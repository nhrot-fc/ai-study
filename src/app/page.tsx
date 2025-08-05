// src/app/page.tsx
import { prisma } from '@/lib/prisma';
import { Card, CardHeader, CardTitle } from '@/components/ui/card'; // shadcn component

// Esta función se ejecuta en el servidor
async function getCourses() {
  const courses = await prisma.content.findMany({
    where: {
      content_type: 'COURSE',
      is_private: false,
    },
    orderBy: {
      created_at: 'desc',
    },
  });
  return courses;
}

export default async function HomePage() {
  const courses = await getCourses();

  return (
    <main className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-6">Cursos Disponibles</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map((course) => (
          <Card key={course.id}>
            <CardHeader>
              <CardTitle>{course.name}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>
    </main>
  );
}