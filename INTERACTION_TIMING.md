# Interaction Event Timing Implementation

## Overview
This implementation adds timing tracking to interaction events to measure the lag between when a user clicks the splash button and when the splash appears on the billboard screen.

## Database Changes

### Schema Updates (`prisma/schema.prisma`)
Added two new fields to the `InteractionEvent` model:
- `clickedAt`: DateTime? - Timestamp when user clicked the splash button
- `displayedAt`: DateTime? - Timestamp when splash appeared on billboard screen

### Migration
Created migration: `20260217115248_add_interaction_timing`
- Adds `clickedAt` and `displayedAt` columns to `InteractionEvent` table
- Both columns are nullable to support existing records

## API Changes

### `/api/interaction` (POST)
**Updated to:**
1. Accept `clickedAt` timestamp from client
2. Create interaction event with `clickedAt` timestamp
3. Include `interactionId` in the socket broadcast to enable display confirmation

**Request body now includes:**
```json
{
  "screen_id": "string",
  "color": "string",
  "fingerprint": "string",
  "userName": "string",
  "isBonus": "boolean",
  "clickedAt": "ISO 8601 timestamp"
}
```

### `/api/interaction/displayed` (POST) - NEW
**Purpose:** Record when splash is displayed on billboard

**Request body:**
```json
{
  "interactionId": "string"
}
```

**Response:**
```json
{
  "success": true
}
```

### `/api/admin/screens/[id]` (GET)
**Updated to:**
- Calculate average lag from all interactions with timing data
- Calculate missed rate (interactions clicked but not displayed)
- Return comprehensive performance metrics

**Response now includes:**
```json
{
  "avgLag": 1234, // milliseconds, or null if no data
  "missedRate": 2.5, // percentage of missed interactions
  "missedCount": 5, // absolute number of missed interactions
  "clickedCount": 200, // total interactions clicked
  "displayedCount": 195 // total interactions displayed
}
```

## Frontend Changes

### Mobile Throw Page (`/throw/[id]/page.tsx`)
- Captures click timestamp when user clicks "SPLASH NOW"
- Sends `clickedAt` timestamp to API

### Billboard Page (`/billboard/[id]/page.tsx`)
- Receives `interactionId` in socket event
- Sends display confirmation to `/api/interaction/displayed` when splash is rendered
- This records the `displayedAt` timestamp

### Admin Screen Details (`/admin/screens/[id]/page.tsx`)
**Enhanced to show:**
1. **Average Latency Card** - Displays real calculated average lag
2. **Missed Rate Card** - Shows percentage of interactions that failed to display with color coding:
   - Green: 0% (perfect reliability)
   - Yellow: < 5% (acceptable)
   - Red: ≥ 5% (needs attention)
3. **Individual Interaction Lag** - Shows lag for each interaction with color coding:
   - Green: < 1000ms (good)
   - Yellow: 1000-2000ms (acceptable)
   - Red: > 2000ms (needs attention)
4. **Missed Event Indicators** - Interactions that were clicked but not displayed are:
   - Highlighted with red background
   - Marked with "MISSED" badge in red

## Data Flow

1. **User clicks splash button** → `clickedAt` timestamp captured
2. **API receives request** → Creates interaction event with `clickedAt`
3. **Socket broadcasts** → Includes `interactionId` in splash data
4. **Billboard receives** → Renders splash
5. **Billboard confirms** → Sends `interactionId` to `/api/interaction/displayed`
6. **API updates** → Sets `displayedAt` timestamp
7. **Admin views** → Sees lag = `displayedAt - clickedAt`

## Benefits

1. **Performance Monitoring** - Track real-time latency of the system
2. **Reliability Tracking** - Monitor missed interactions to identify system failures
3. **User Experience** - Identify and fix lag issues
4. **Analytics** - Understand system performance and reliability over time
5. **Debugging** - Pinpoint bottlenecks and failure points in the interaction flow
6. **Quality Assurance** - Ensure high delivery rate (low missed rate)

## Example Lag Calculation

```typescript
const lag = event.clickedAt && event.displayedAt 
  ? new Date(event.displayedAt).getTime() - new Date(event.clickedAt).getTime()
  : null;
```

Result is in milliseconds, showing the total time from user click to billboard display.
