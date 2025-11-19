'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface ProjectCard {
  _id: string;
  title: string;
  category: string;
  status: string;
  technologies: string[];
}

const ProjectsDashboardPage = () => {
  const router = useRouter();
  const [projects, setProjects] = useState<ProjectCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('/api/project', { cache: 'no-store' });
        const data = await res.json();

        if (data.success) {
          setProjects(data.project);
        } else {
          setError(data.error || 'Failed to load projects');
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load projects');
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      const res = await fetch('/api/project', {
        method: 'DELETE',
        body: JSON.stringify({ id }),
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();

      if (data.success) {
        setProjects(projects.filter(p => p._id !== id));
      } else {
        alert(data.error || 'Failed to delete project');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to delete project');
    }
  };

  if (loading) return <p className="text-center mt-10 text-black">Loading projects...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-black">Projects Dashboard</h1>
        <button
          onClick={() => router.push('/dashboard/project/create')}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500 transition"
        >
          + Create Project
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-black">Title</th>
              <th className="px-4 py-2 text-left text-black">Category</th>
              <th className="px-4 py-2 text-left text-black">Status</th>
              <th className="px-4 py-2 text-left text-black">Technologies</th>
              <th className="px-4 py-2 text-left text-black">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {projects.map(project => (
              <tr key={project._id}>
                <td className="px-4 py-2 text-black">{project.title}</td>
                <td className="px-4 py-2 text-black">{project.category}</td>
                <td className="px-4 py-2 text-black">{project.status}</td>
                <td className="px-4 py-2 text-black">{project.technologies.join(', ')}</td>
                <td className="px-4 py-2 flex gap-2">
                  <button
                    onClick={() => router.push(`/dashboard/project/${project._id}`)}
                    className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-400 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(project._id)}
                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-400 transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProjectsDashboardPage;
