export type TabId = 'timetable' | 'overview' | 'safety' | 'log'

export interface Tab {
  id: TabId
  label: string
}
