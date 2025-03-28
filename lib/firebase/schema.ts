/* eslint-disable */
import { Timestamp } from "firebase/firestore";
// Collection Types
type CollectionName =
  | "users"
  | "subjects"
  | "notes"
  | "comments"
  | "chats"
  | "questions"
  | "answers"
  | "quizSessions"
  | "forms"
  | "projects";

// Base Document Types
interface BaseDocument {
  id: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

interface User extends BaseDocument {
  username: string;
  email: string;
  isAdmin:string;
  name: string;
  passwordHash: string;
  lastLogin: Timestamp;
  profilePic?: string;
  subjectIds: string[];  // References to Subject docs
  noteIds: string[];     // References to Note docs
  chatIds: string[];     // References to Chat docs
}

interface Subject extends BaseDocument {
  name: string;
  credits: number;
  program: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  prerequisites: string[];
  instructors: string[];
  progress: {
    material: number;
    quiz: number;
  };
  materials: {
    notes: string[];      // References to Note docs
    quizzes: string[];    // References to Quiz docs
    questions: string[];  // References to Question docs
  };
}

interface Note  {
  NoteId:string;
  subjectId: string;     // Reference to parent Subject
  authorId: string;      // Reference to User
  coAuthorsIds:string[];
  timeCreated: Timestamp;
  lastModified: Timestamp;
  title:string;
  content: string;
  sharedStatus:Boolean;
  publicStatus:Boolean;
  referencedMaterialNotes: string[];
  referencedPersonalNotes:string[];
  referencedPublicNotes:string[];
  comments: {
    userId: string;
    text: string;
    timestamp: Timestamp;
  }[];
}


export type { CollectionName, User, Subject, Note };