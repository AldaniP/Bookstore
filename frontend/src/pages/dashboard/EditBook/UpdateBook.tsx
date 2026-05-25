import { useEffect } from "react";
import InputField from "../addBook/InputField";
import SelectField from "../addBook/SelectField";
import { useForm } from "react-hook-form";
import { useParams } from "react-router";
import { useFetchBookByIdQuery } from "../../../redux/features/books/booksApi";
import Loading from "../../../components/Loading";
import Swal from "sweetalert2";
import axios from "axios";
import getBaseUrl from "../../../utils/baseURL";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../../firebase/firebase.config";
import { useState } from "react";
import { resizeImage } from "../../../utils/resizeImage";

const UpdateBook = () => {
  const { id } = useParams();
  const {
    data: bookData,
    isLoading,
    isError,
    refetch,
  } = useFetchBookByIdQuery(id);

  const { register, handleSubmit, setValue } = useForm<UpdateBookFormData>();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  useEffect(() => {
    if (bookData) {
      setValue("title", bookData.title);
      setValue("description", bookData.description);
      setValue("category", bookData?.category);
      setValue("trending", bookData.trending);
      setValue("oldPrice", bookData.oldPrice);
      setValue("newPrice", bookData.newPrice);
      setValue("coverImage", bookData.coverImage);
    }
  }, [bookData, setValue]);

  interface UpdateBookFormData {
    title: string;
    description: string;
    category: string;
    trending: boolean;
    oldPrice: string | number;
    newPrice: string | number;
    coverImage?: string;
  }

  interface UpdateBookPayload {
    title: string;
    description: string;
    category: string;
    trending: boolean;
    oldPrice: number;
    newPrice: number;
    coverImage: string;
  }

  const onSubmit = async (data: UpdateBookFormData) => {
    let downloadURL = data.coverImage || bookData.coverImage;

    if (imageFile) {
      setIsUploading(true);
      try {
        // Resize new image to 300x450 (standard book aspect ratio) before upload
        const resizedImage = await resizeImage(imageFile, 300, 450);
        const storageRef = ref(storage, `books/${resizedImage.name}`);
        await uploadBytes(storageRef, resizedImage);
        downloadURL = await getDownloadURL(storageRef);
      } catch (error) {
        console.error("Firebase upload error", error);
        alert("Failed to upload image. Please check your Firebase Storage rules.");
        setIsUploading(false);
        return;
      }
    }

    const updateBookData: UpdateBookPayload = {
      title: data.title,
      description: data.description,
      category: data.category,
      trending: data.trending,
      oldPrice: Number(data.oldPrice),
      newPrice: Number(data.newPrice),
      coverImage: downloadURL,
    };
    try {
      await axios.put(`${getBaseUrl()}/api/books/edit/${id}`, updateBookData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      Swal.fire({
        title: "Book Updated",
        text: "Your book is updated successfully!",
        icon: "success",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, It's Okay!",
      });
      setIsUploading(false);
      await refetch();
    } catch {
      console.log("Failed to update book.");
      alert("Failed to update book.");
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };
  if (isLoading) return <Loading />;
  if (isError) return <div>Error fetching book data</div>;
  return (
    <div className="max-w-lg mx-auto md:p-6 p-3 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Update Book</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <InputField
          label="Title"
          name="title"
          placeholder="Enter book title"
          register={register}
        />

        <InputField
          label="Description"
          name="description"
          placeholder="Enter book description"
          type="textarea"
          register={register}
        />

        <SelectField
          label="Category"
          name="category"
          options={[
            { value: "", label: "Choose A Category" },
            { value: "business", label: "Business" },
            { value: "technology", label: "Technology" },
            { value: "fiction", label: "Fiction" },
            { value: "horror", label: "Horror" },
            { value: "adventure", label: "Adventure" },
          ]}
          register={register}
        />
        <div className="mb-4">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              {...register("trending")}
              className="rounded text-blue-600 focus:ring focus:ring-offset-2 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm font-semibold text-gray-700">
              Trending
            </span>
          </label>
        </div>

        <InputField
          label="Old Price"
          name="oldPrice"
          type="number"
          placeholder="Old Price"
          register={register}
        />

        <InputField
          label="New Price"
          name="newPrice"
          type="number"
          placeholder="New Price"
          register={register}
        />

        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Cover Image (Upload Baru Opsional)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mb-2 w-full"
          />
          {imageFile && (
            <p className="text-sm text-gray-500">New Image Selected: {imageFile.name}</p>
          )}
          {!imageFile && bookData?.coverImage && (
            <p className="text-sm text-gray-500">Current Image: {bookData.coverImage}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-blue-500 text-white font-bold rounded-md"
          disabled={isUploading}
        >
          {isUploading ? "Uploading Image..." : "Update Book"}
        </button>
      </form>
    </div>
  );
};

export default UpdateBook;
