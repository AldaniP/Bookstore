const Services = () => {
  return (
    <div className="max-w-5xl mx-auto py-10">
      <h1 className="text-4xl font-bold mb-6">Our Services</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-6 border rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">
            Online Book Catalog
          </h2>
          <p>
            Browse a wide collection of books from various categories and authors.
          </p>
        </div>

        <div className="p-6 border rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">
            Secure Authentication
          </h2>
          <p>
            User authentication powered by Firebase for secure access.
          </p>
        </div>

        <div className="p-6 border rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">
            Shopping Cart
          </h2>
          <p>
            Add books to cart and manage purchases easily.
          </p>
        </div>

        <div className="p-6 border rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">
            Admin Management
          </h2>
          <p>
            Administrators can add, edit, and manage book collections.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Services;