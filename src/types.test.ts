import { describe, it, expect } from 'vitest'
import {
  appleToUnix,
  unixToDate,
  appleToDate,
  priorityLabel,
  APPLE_EPOCH_OFFSET,
} from './types.js'

describe('appleToUnix', () => {
  it('converts Apple epoch 0 to Unix epoch offset', () => {
    expect(appleToUnix(0)).toBe(APPLE_EPOCH_OFFSET)
  })

  it('converts a known Apple timestamp (seconds since 2001)', () => {
    // 2024-01-01 00:00:00 UTC = 1704067200 Unix
    // Apple seconds = 1704067200 - 978307200 = 725760000
    expect(appleToUnix(725760000)).toBe(1704067200)
  })

  it('floors fractional seconds', () => {
    expect(appleToUnix(100.7)).toBe(100 + APPLE_EPOCH_OFFSET)
  })

  it('handles negative values (before 2001)', () => {
    expect(appleToUnix(-APPLE_EPOCH_OFFSET)).toBe(0) // Unix epoch
  })
})

describe('unixToDate', () => {
  it('converts Unix epoch 0 to Jan 1 1970', () => {
    const date = unixToDate(0)
    expect(date.getUTCFullYear()).toBe(1970)
    expect(date.getUTCMonth()).toBe(0)
    expect(date.getUTCDate()).toBe(1)
  })

  it('converts a known timestamp', () => {
    const date = unixToDate(1704067200)
    expect(date.getUTCFullYear()).toBe(2024)
    expect(date.getUTCMonth()).toBe(0)
    expect(date.getUTCDate()).toBe(1)
  })
})

describe('appleToDate', () => {
  it('converts Apple epoch 0 to Jan 1 2001', () => {
    const date = appleToDate(0)
    expect(date.getUTCFullYear()).toBe(2001)
    expect(date.getUTCMonth()).toBe(0)
    expect(date.getUTCDate()).toBe(1)
  })

  it('composes correctly for a known date', () => {
    const date = appleToDate(725760000)
    expect(date.getUTCFullYear()).toBe(2024)
  })
})

describe('priorityLabel', () => {
  it('returns "High" for priority 1', () => {
    expect(priorityLabel(1)).toBe('High')
  })

  it('returns "Medium" for priority 5', () => {
    expect(priorityLabel(5)).toBe('Medium')
  })

  it('returns "Low" for priority 9', () => {
    expect(priorityLabel(9)).toBe('Low')
  })

  it('returns empty string for priority 0 (none)', () => {
    expect(priorityLabel(0)).toBe('')
  })

  it('returns empty string for unknown priorities', () => {
    expect(priorityLabel(3)).toBe('')
    expect(priorityLabel(99)).toBe('')
  })
})
