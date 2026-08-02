import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { schoolDB } from '@/lib/platform-db';
import { ModernButton } from '@/components/ui/ModernButton';
import { ModernCard } from '@/components/ui/ModernCard';
import { DataState } from '@/components/ui/states';
import { ArrowLeft, Save, ClipboardCheck } from 'lucide-react';
import { toast } from 'sonner';

/**
 * AssignmentGrading
 *
 * BismiLLAH Ar-Rahman Ar-Roheem.
 *
 * Allows a teacher to review a student's submission and assign a
 * grade with feedback. Accessible at /school/portal/grading/:id.
 */
const AssignmentGrading: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [submission, setSubmission] = useState<any>(null);
  const [assignment, setAssignment] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [grade, setGrade] = useState('');
  const [feedback, setFeedback] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      setIsLoading(true);
      setError(null);
      try {
        const subs = await schoolDB.get('lms_submissions');
        const found = subs.find((s: any) => s.id === id);
        if (!found) {
          setError(new Error('Submission not found'));
          return;
        }
        setSubmission(found);
        setGrade(found.grade?.toString() || '');
        setFeedback(found.feedback || '');
        // Load the assignment
        const assignments = await schoolDB.get('lms_assignments');
        const a = assignments.find((a: any) => a.id === found.assignmentId);
        setAssignment(a);
      } catch (err: any) {
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [id]);

  const handleSave = async () => {
    if (!submission) return;
    setSaving(true);
    try {
      const gradeNum = parseFloat(grade);
      if (isNaN(gradeNum)) {
        toast.error('Please enter a valid grade number');
        setSaving(false);
        return;
      }
      const maxPoints = assignment?.maxPoints || 100;
      if (gradeNum < 0 || gradeNum > maxPoints) {
        toast.error(`Grade must be between 0 and ${maxPoints}`);
        setSaving(false);
        return;
      }
      await schoolDB.update('lms_submissions', submission.id, {
        grade: gradeNum,
        feedback,
        status: 'graded',
        gradedAt: new Date().toISOString(),
        gradedBy: 'teacher',
      });
      toast.success('Grade saved successfully');
      navigate('/school/portal/teacher');
    } catch (err: any) {
      console.error('Error saving grade:', err);
      toast.error('Failed to save grade');
    } finally {
      setSaving(false);
    }
  };

  if (isLoading || error) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <DataState
            isLoading={isLoading}
            error={error}
            isEmpty={false}
            onRetry={() => window.location.reload()}
          >
            <div />
          </DataState>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/school/portal/teacher')}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Teacher Portal
        </button>

        <div className="flex items-center gap-3 mb-8">
          <ClipboardCheck className="h-6 w-6 text-platform-accent" />
          <h1 className="text-2xl font-bold text-foreground">Grade Submission</h1>
        </div>

        {/* Assignment details */}
        {assignment && (
          <ModernCard className="mb-6">
            <h2 className="font-semibold text-foreground mb-2">{assignment.title}</h2>
            <p className="text-sm text-muted-foreground mb-3">{assignment.description}</p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Max points: <strong className="text-foreground">{assignment.maxPoints || 100}</strong></span>
              {assignment.dueDate && (
                <span>Due: <strong className="text-foreground">{new Date(assignment.dueDate).toLocaleDateString()}</strong></span>
              )}
            </div>
          </ModernCard>
        )}

        {/* Student submission */}
        <ModernCard className="mb-6">
          <h3 className="font-semibold text-foreground mb-3">Student Submission</h3>
          {submission?.content ? (
            <div className="bg-secondary rounded-md p-4 text-sm text-foreground whitespace-pre-wrap">
              {submission.content}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic">No written content submitted.</p>
          )}
          {submission?.submittedAt && (
            <p className="text-xs text-muted-foreground mt-3">
              Submitted: {new Date(submission.submittedAt).toLocaleString()}
            </p>
          )}
        </ModernCard>

        {/* Grading form */}
        <ModernCard>
          <h3 className="font-semibold text-foreground mb-4">Grade & Feedback</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">
                Grade (out of {assignment?.maxPoints || 100})
              </label>
              <input
                type="number"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                placeholder="Enter grade"
                min="0"
                max={assignment?.maxPoints || 100}
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">
                Feedback (optional)
              </label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Provide feedback to the student..."
                rows={5}
                className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="flex gap-3">
              <ModernButton onClick={handleSave} disabled={saving}>
                <Save className="h-4 w-4" />
                {saving ? 'Saving...' : 'Save Grade'}
              </ModernButton>
              <ModernButton variant="outline" onClick={() => navigate('/school/portal/teacher')}>
                Cancel
              </ModernButton>
            </div>
          </div>
        </ModernCard>
      </div>
    </div>
  );
};

export default AssignmentGrading;
