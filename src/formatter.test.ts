import { describe, it, expect, beforeAll } from 'vitest'
import chalk from 'chalk'
import {
  formatSearchResult,
  formatReminderSimple,
  formatStats,
  formatNoResults,
  formatIndexProgress,
  formatListHeader,
} from './formatter.js'
import type { IndexedReminder, SearchResult, IndexStats } from './types.js'

beforeAll(() => {
  chalk.level = 0
})

function makeReminder(overrides: Partial<IndexedReminder> = {}): IndexedReminder {
  return {
    id: 1,
    title: 'Buy groceries',
    notes: '',
    listName: 'Shopping',
    listId: 1,
    completed: false,
    flagged: false,
    priority: 0,
    dueDate: null,
    creationDate: 1704067200,
    completionDate: null,
    ...overrides,
  }
}

function makeSearchResult(overrides: Partial<IndexedReminder> = {}): SearchResult {
  return {
    reminder: makeReminder(overrides),
    score: 5.0,
    matchedTerms: ['groceries'],
  }
}

describe('formatSearchResult', () => {
  it('includes the reminder title', () => {
    const output = formatSearchResult(makeSearchResult({ title: 'Call dentist' }))
    expect(output).toContain('Call dentist')
  })

  it('includes the list name when showList is true', () => {
    const output = formatSearchResult(makeSearchResult({ listName: 'Health' }), true)
    expect(output).toContain('Health')
  })

  it('includes notes preview', () => {
    const output = formatSearchResult(makeSearchResult({ notes: 'Remember to bring the list' }))
    expect(output).toContain('Remember to bring the list')
  })

  it('truncates long notes with ellipsis', () => {
    const longNotes = 'a'.repeat(150)
    const output = formatSearchResult(makeSearchResult({ notes: longNotes }))
    expect(output).toContain('...')
  })

  it('shows checkbox for incomplete reminders', () => {
    const output = formatSearchResult(makeSearchResult({ completed: false }))
    expect(output).toContain('[ ]')
  })

  it('shows checked box for completed reminders', () => {
    const output = formatSearchResult(makeSearchResult({ completed: true }))
    expect(output).toContain('[x]')
  })
})

describe('formatReminderSimple', () => {
  it('includes the title', () => {
    const output = formatReminderSimple(makeReminder({ title: 'Walk the dog' }))
    expect(output).toContain('Walk the dog')
  })

  it('shows checkbox state', () => {
    expect(formatReminderSimple(makeReminder({ completed: false }))).toContain('[ ]')
    expect(formatReminderSimple(makeReminder({ completed: true }))).toContain('[x]')
  })

  it('shows priority indicator for high priority', () => {
    const output = formatReminderSimple(makeReminder({ priority: 1 }))
    expect(output).toContain('!')
  })

  it('shows flag indicator for flagged reminders', () => {
    const output = formatReminderSimple(makeReminder({ flagged: true }))
    expect(output).toContain('\u2691') // Flag unicode
  })
})

describe('formatStats', () => {
  it('includes all stats fields', () => {
    const stats: IndexStats = {
      totalReminders: 500,
      totalLists: 8,
      completedReminders: 300,
      pendingReminders: 200,
      indexedAt: new Date('2024-01-01'),
      oldestReminder: new Date('2020-01-01'),
      newestReminder: new Date('2024-01-01'),
    }
    const output = formatStats(stats)
    expect(output).toContain('500')
    expect(output).toContain('8')
    expect(output).toContain('300')
    expect(output).toContain('200')
  })

  it('includes date range', () => {
    const stats: IndexStats = {
      totalReminders: 10,
      totalLists: 2,
      completedReminders: 5,
      pendingReminders: 5,
      indexedAt: new Date('2024-06-01'),
      oldestReminder: new Date('2023-01-15'),
      newestReminder: new Date('2024-06-01'),
    }
    const output = formatStats(stats)
    expect(output).toContain('2023')
    expect(output).toContain('2024')
  })
})

describe('formatNoResults', () => {
  it('includes the query', () => {
    const output = formatNoResults('groceries')
    expect(output).toContain('groceries')
  })

  it('indicates no reminders found', () => {
    const output = formatNoResults('test')
    expect(output.toLowerCase()).toContain('no reminders found')
  })
})

describe('formatIndexProgress', () => {
  it('shows reading phase', () => {
    const output = formatIndexProgress('reading', 50, 200)
    expect(output).toContain('Reading reminders')
    expect(output).toContain('25%')
  })

  it('shows FTS indexing phase', () => {
    const output = formatIndexProgress('indexing-fts', 100, 100)
    expect(output).toContain('Building search index')
    expect(output).toContain('100%')
  })

  it('shows fuzzy indexing phase', () => {
    const output = formatIndexProgress('indexing-fuzzy', 75, 100)
    expect(output).toContain('Building fuzzy index')
  })

  it('shows done phase', () => {
    const output = formatIndexProgress('done', 100, 100)
    expect(output).toContain('Done')
  })

  it('handles zero total without crashing', () => {
    const output = formatIndexProgress('reading', 0, 0)
    expect(output).toContain('0%')
  })
})

describe('formatListHeader', () => {
  it('includes list name and pending count', () => {
    const output = formatListHeader('Shopping', 5)
    expect(output).toContain('Shopping')
    expect(output).toContain('5 pending')
  })
})
