import mongoose, { Schema } from 'mongoose';

const todoSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
},
{
  timestamps: true
});

export default mongoose.models.Todo || mongoose.model('Todo', todoSchema);