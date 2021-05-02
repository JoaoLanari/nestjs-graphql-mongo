import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lesson } from './lesson.entity';
import { v4 as uuid } from 'uuid';
import { CreateLessonInput } from './lesson.input';
import { isArray } from 'class-validator';

@Injectable()
export class LessonService {
  constructor(
    @InjectRepository(Lesson)
    private lessonRepository: Repository<Lesson>,
  ) {}

  createLesson(createLessonInput: CreateLessonInput): Promise<Lesson> {
    const { name, startDate, endDate, students } = createLessonInput;
    const lesson = this.lessonRepository.create({
      id: uuid(),
      name,
      startDate,
      endDate,
      students,
    });

    return this.lessonRepository.save(lesson);
  }

  getLesson(id: string): Promise<Lesson> {
    return this.lessonRepository.findOne({ id });
  }

  getLessons(): Promise<Lesson[]> {
    return this.lessonRepository.find();
  }

  async assingnStudentsToLesson(
    lessonId: string,
    studentsIds: string[],
  ): Promise<Lesson> {
    const lesson = await this.lessonRepository.findOne({ id: lessonId });
    lesson.students = isArray(lesson.students)
      ? [...lesson.students, ...studentsIds]
      : [...studentsIds];

    return this.lessonRepository.save(lesson);
  }
}
