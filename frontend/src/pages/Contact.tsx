const Contact = () => {
  return (
    <div className="max-w-4xl mx-auto py-10">
      <h1 className="text-4xl font-bold mb-6">Contact Us</h1>

      <div className="space-y-4">
        <p>
          Have questions or feedback? Feel free to contact our team.
        </p>

        <div>
          <h2 className="font-semibold">Email</h2>
          <p>bookstore.team@example.com</p>
        </div>

        <div>
          <h2 className="font-semibold">Project Repository</h2>
          <p>
            GitHub: Bookstore Project
          </p>
        </div>

        <div>
          <h2 className="font-semibold">Development Team</h2>
          <ul className="list-disc pl-6">
            <li>Aldani – DevOps & Cloud Infrastructure</li>
            <li>Umar – Backend & Database</li>
            <li>I Nyoman – Frontend Integrator</li>
            <li>Shafly – QA & Documentation</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Contact;