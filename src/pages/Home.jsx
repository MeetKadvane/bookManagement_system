import { useEffect, useState } from "react";
import API from "../services/api";

function Home() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    genre: "",
    year: "",
  });

  const [editId, setEditId] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");

  const [selectedGenre, setSelectedGenre] =
    useState("All");

  const fetchBooks = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get("/books");

      setBooks(response.data);
    } catch (err) {
      setError("Failed to fetch books");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editId) {
        await API.put(`/books/${editId}`, formData);

        setEditId(null);
      } else {
        await API.post("/books", formData);
      }

      fetchBooks();

      setFormData({
        title: "",
        author: "",
        genre: "",
        year: "",
      });
    } catch (err) {
      console.log(err);

      setError(
        editId
          ? "Failed to update book"
          : "Failed to add book"
      );
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/books/${id}`);

      fetchBooks();
    } catch (err) {
      console.log(err);
      setError("Failed to delete book");
    }
  };

  const handleEdit = (book) => {
    setFormData({
      title: book.title,
      author: book.author,
      genre: book.genre,
      year: book.year,
    });

    setEditId(book.id);
  };

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      book.author
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesGenre =
      selectedGenre === "All" ||
      book.genre === selectedGenre;

    return matchesSearch && matchesGenre;
  });

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-100 to-gray-200 p-6">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
        Book Management System
      </h1>

      <div className="max-w-3xl mx-auto mb-6 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search by title or author..."
          value={searchTerm}
          onChange={(e) =>
            setSearchTerm(e.target.value)
          }
          className="flex-1 border border-gray-300 p-3 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <select
          value={selectedGenre}
          onChange={(e) =>
            setSelectedGenre(e.target.value)
          }
          className="border border-gray-300 p-3 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="All">All Genres</option>
          <option value="Fantasy">Fantasy</option>
          <option value="Self Help">
            Self Help
          </option>
          <option value="Fiction">Fiction</option>
          <option value="Science">Science</option>
          <option value="Biography">
            Biography
          </option>
        </select>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-lg mb-8 max-w-3xl mx-auto"
      >
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          {editId ? "Edit Book" : "Add New Book"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="title"
            placeholder="Book Title"
            value={formData.title}
            onChange={handleChange}
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />

          <input
            type="text"
            name="author"
            placeholder="Author"
            value={formData.author}
            onChange={handleChange}
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />

          <input
            type="text"
            name="genre"
            placeholder="Genre"
            value={formData.genre}
            onChange={handleChange}
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />

          <input
            type="text"
            name="year"
            placeholder="Publication Year"
            value={formData.year}
            onChange={handleChange}
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <button
          type="submit"
          className="mt-4 bg-blue-500 hover:bg-blue-600 transition duration-300 text-white px-6 py-3 rounded-lg shadow-md"
        >
          {editId ? "Update Book" : "Add Book"}
        </button>
      </form>

      {loading && (
        <p className="text-center text-blue-500 text-lg">
          Loading books...
        </p>
      )}

      {error && (
        <p className="text-center text-red-500 mb-4 text-lg">
          {error}
        </p>
      )}

      {!loading && books.length === 0 && (
        <p className="text-center text-gray-500 text-lg mt-10">
          No books found
        </p>
      )}

      {!loading &&
        books.length > 0 &&
        filteredBooks.length === 0 && (
          <p className="text-center text-gray-500 text-lg mt-10">
            No matching books found
          </p>
        )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBooks.map((book) => (
          <div
            key={book.id}
            className="bg-white p-5 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition duration-300"
          >
            <h2 className="text-2xl font-bold mb-3 text-gray-800">
              {book.title}
            </h2>

            <p className="text-gray-700 mb-2">
              <span className="font-semibold">
                Author:
              </span>{" "}
              {book.author}
            </p>

            <p className="text-gray-700 mb-2">
              <span className="font-semibold">
                Genre:
              </span>{" "}
              {book.genre}
            </p>

            <p className="text-gray-700">
              <span className="font-semibold">
                Year:
              </span>{" "}
              {book.year}
            </p>

            <div className="mt-5 flex gap-3">
              <button
                onClick={() => handleEdit(book)}
                className="bg-yellow-500 hover:bg-yellow-600 transition duration-300 text-white px-4 py-2 rounded-lg shadow"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(book.id)}
                className="bg-red-500 hover:bg-red-600 transition duration-300 text-white px-4 py-2 rounded-lg shadow"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;