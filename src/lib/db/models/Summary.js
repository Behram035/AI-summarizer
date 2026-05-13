import mongoose from 'mongoose';

const SummarySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      default: 'Untitled Summary',
      maxlength: 200,
    },
    inputType: {
      type: String,
      enum: ['text', 'audio', 'voice_note'],
      required: true,
    },
    originalText: {
      type: String,
      required: true,
    },
    transcribedText: {
      type: String,
      default: '',
    },
    summary: {
      type: String,
      required: true,
    },
    bulletPoints: {
      type: [String],
      default: [],
    },
    keyNotes: {
      type: [String],
      default: [],
    },
    sentiment: {
      type: String,
      enum: ['positive', 'neutral', 'negative', 'mixed'],
      default: 'neutral',
    },
    wordCount: {
      type: Number,
      default: 0,
    },
    readingTime: {
      type: Number, // in minutes
      default: 0,
    },
    language: {
      type: String,
      default: 'en',
    },
    tags: {
      type: [String],
      default: [],
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
    audioUrl: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Auto-generate title from summary
SummarySchema.pre('save', function (next) {
  if (!this.title || this.title === 'Untitled Summary') {
    this.title = this.summary.split(' ').slice(0, 8).join(' ') + '...';
  }
  this.wordCount = this.originalText.split(/\s+/).length;
  this.readingTime = Math.ceil(this.wordCount / 200);
  next();
});

const Summary = mongoose.models.Summary || mongoose.model('Summary', SummarySchema);

export default Summary;
