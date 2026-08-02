import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { schoolDB } from '@/lib/platform-db';
import { ModernButton } from '@/components/ui/ModernButton';
import { ModernCard } from '@/components/ui/ModernCard';
import { DataState } from '@/components/ui/states';
import { useListData } from '@/hooks/useListData';
import {
  BookOpen,
  Users,
  ClipboardCheck,
  FileQuestion,
  Plus,
  ArrowRight,
  GraduationCap,
  Clock,
  CheckCircle,
} from 'lucide-react';

/**
 * TeacherPortal
 *
 * BismiLLAH Ar-Rahman Ar-Roheem.
 *
 * The teacher's dashboard. Shows their assigned courses, pending
 * assignment submissions to grade, and quick actions for creating
 * quizzes and lessons. Accessible at /school/portal/teacher.
 *
 * Addresses PRODUCTION_GAPS.md item 4.1 (School LMS incomplete).
 */
const TeacherPortal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'courses' | 'grading' | 'quizzes'>('courses');

  const { data: courses, isLoading: coursesLoading, error: coursesError, refetch: refetchCourses } = useListData(() => schoolDB.get('lms_courses'));
  const { data: submissions, isLoading: subLoading, error: subError, refetch: refetchSubs } = useListData(() => schoolDB.get('lms_submissions'));
  const { data: lessons } = useListData(() => schoolDB.get('lms_lessons'));

  const pendingGrading = submissions.filter((s: any) => s.status === 'submitted' && !s.grade);

  const stats = [
    { label: 'My Courses', value: courses.length, icon: BookOpen, color: 'text-platform-accent' },
    { label: 'Total Lessons', value: lessons.length, icon: GraduationCap, color: 'text-platform-accent' },
    { label: 'Pending Grading', value: pendingGrading.length, icon: ClipboardCheck, color: 'text-warning' },
    { label: 'Total Students', value: 0, icon: Users, color: 'text-platform-accent' },
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Teacher Portal</h1>
          <p className="text-muted-foreground">Manage your courses, grade assignments, and create quizzes</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="rounded-lg border border-border bg-card p-5">
                <Icon className={`h-5 w-5 ${stat.color} mb-2`} />
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 border-b border-border">
          {[
            { key: 'courses', label: 'My Courses', icon: BookOpen },
            { key: 'grading', label: `Grading Queue${pendingGrading.length > 0 ? ` (${pendingGrading.length})` : ''}`, icon: ClipboardCheck },
            { key: 'quizzes', label: 'Quizzes & Lessons', icon: FileQuestion },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.key
                    ? 'border-platform-accent text-platform-accent'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        {activeTab === 'courses' && (
          <DataState
            isLoading={coursesLoading}
            error={coursesError}
            isEmpty={!coursesLoading && !coursesError && courses.length === 0}
            onRetry={refetchCourses}
            emptyTitle="No courses assigned yet"
            emptyMessage="Contact your administrator to be assigned to a course."
          >
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course: any) => {
                const courseLessons = lessons.filter((l: any) => l.courseId === course.id);
                return (
                  <ModernCard key={course.id} hover>
                    <div className="mb-3">
                      <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-platform-accent-soft text-platform-accent mb-2">
                        {course.level || 'Course'}
                      </span>
                      <h3 className="font-semibold text-foreground">{course.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{course.description}</p>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <span className="flex items-center gap-1">
                        <GraduationCap className="h-4 w-4" /> {courseLessons.length} lessons
                      </span>
                      {course.duration && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" /> {course.duration}h
                        </span>
                      )}
                    </div>
                    <Link to={`/school/portal/courses/${course.id}`}>
                      <ModernButton variant="outline" className="w-full">
                        Manage Course
                        <ArrowRight className="h-4 w-4" />
                      </ModernButton>
                    </Link>
                  </ModernCard>
                );
              })}
            </div>
          </DataState>
        )}

        {activeTab === 'grading' && (
          <DataState
            isLoading={subLoading}
            error={subError}
            isEmpty={!subLoading && !subError && pendingGrading.length === 0}
            onRetry={refetchSubs}
            emptyTitle="No submissions to grade"
            emptyMessage="Student submissions awaiting your review will appear here."
          >
            <div className="space-y-4">
              {pendingGrading.map((sub: any) => (
                <ModernCard key={sub.id}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle className="h-4 w-4 text-warning" />
                        <span className="font-medium text-foreground">Submission from {sub.studentId}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Assignment: {sub.assignmentId}
                      </p>
                      {sub.content && (
                        <p className="text-sm text-foreground bg-secondary rounded-md p-3 mb-3">
                          {sub.content}
                        </p>
                      )}
                      {sub.submittedAt && (
                        <p className="text-xs text-muted-foreground">
                          Submitted: {new Date(sub.submittedAt).toLocaleString()}
                        </p>
                      )}
                    </div>
                    <Link to={`/school/portal/grading/${sub.id}`}>
                      <ModernButton size="sm">
                        Grade
                        <ArrowRight className="h-4 w-4" />
                      </ModernButton>
                    </Link>
                  </div>
                </ModernCard>
              ))}
            </div>
          </DataState>
        )}

        {activeTab === 'quizzes' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-foreground">Lessons & Quizzes</h3>
              <Link to="/school/admin/courses/new">
                <ModernButton size="sm">
                  <Plus className="h-4 w-4" />
                  New Lesson
                </ModernButton>
              </Link>
            </div>
            <DataState
              isLoading={false}
              error={null}
              isEmpty={lessons.length === 0}
              emptyTitle="No lessons yet"
              emptyMessage="Create lessons for your courses to get started."
              emptyActionLabel="New Lesson"
              onEmptyAction={() => (window.location.href = '/school/admin/courses/new')}
            >
              <div className="space-y-3">
                {lessons.map((lesson: any) => (
                  <ModernCard key={lesson.id}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-platform-accent-soft text-platform-accent">
                          <FileQuestion className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="font-medium text-foreground">{lesson.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {lesson.type} · {lesson.duration || 0} min · {lesson.published ? 'Published' : 'Draft'}
                          </p>
                        </div>
                      </div>
                      <Link to={`/school/admin/lessons/${lesson.id}/edit`}>
                        <ModernButton variant="outline" size="sm">
                          Edit
                        </ModernButton>
                      </Link>
                    </div>
                  </ModernCard>
                ))}
              </div>
            </DataState>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherPortal;
