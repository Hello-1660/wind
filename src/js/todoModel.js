// noteModel.js
const NoteStatus = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  ARCHIVED: 'archived'
};

const NotePriority = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high'
};

class Note {
  constructor({
    id = null,
    createdTime = new Date().toISOString(),
    theme = '',
    content = '',
    status = NoteStatus.PENDING,
    deadline = null,
    remindTime = null,
    priority = NotePriority.MEDIUM,
    location = null
  }) {
    this.id = id;
    this.createdTime = createdTime;
    this.theme = theme;
    this.content = content;
    this.status = status;
    this.deadline = deadline;
    this.remindTime = remindTime;
    this.priority = priority;
    this.location = location;
  }
}