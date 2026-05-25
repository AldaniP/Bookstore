import { useState } from "react";
import InputField from "./InputField";
import SelectField from "./SelectField";
import { useForm } from "react-hook-form";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../../firebase/firebase.config";

interface FormData {
  title: string;
  description: string;
  category: string;
  trending: boolean;
  oldPrice: number;
  newPrice: number;
}
import { useAddBookMutation } from "../../../redux/features/books/booksApi";
import Swal from "sweetalert2";
import { resizeImage } from "../../../utils/resizeImage";

const AddBook = () => {
  const { register, handleSubmit, reset } = useForm<FormData>();
  const [addBook, { isLoading }] = useAddBookMutation();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const onSubmit = async (data: FormData) => {
    if (!imageFile) {
      alert("Please select a cover image");
      return;
    }

    setIsUploading(true);
    let downloadURL = "";
    try {
      // Resize image to 300x450 (standard book aspect ratio) before upload
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

    const newBookData = {
      ...data,
      oldPrice: Number(data.oldPrice),
      newPrice: Number(data.newPrice),
      coverImage: downloadURL,
    };
    try {
      await addBook(newBookData).unwrap();
      Swal.fire({
        title: "Book added",
        text: "Your book is uploaded successfully!",
        icon: "success",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, It's Okay!",
      });
      reset();
      setImageFile(null);
      setIsUploading(false);
    } catch (error) {
      console.error(error);
      alert("Failed to add book. Please try again.");
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };
  return (
    <div className="max-w-lg   mx-auto md:p-6 p-3 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Add New Book</h2>

      {}
      <form onSubmit={handleSubmit(onSubmit)} className="">
        {}
        <InputField
          label="Title"
          name="title"
          placeholder="Enter book title"
          register={register}
        />

        {}
        <InputField
          label="Description"
          name="description"
          placeholder="Enter book description"
          type="textarea"
          register={register}
        />

        {}
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

        {}
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

        {}
        <InputField
          label="Old Price"
          name="oldPrice"
          type="number"
          placeholder="Old Price"
          register={register}
        />

        {}
        <InputField
          label="New Price"
          name="newPrice"
          type="number"
          placeholder="New Price"
          register={register}
        />

        {}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Cover Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mb-2 w-full"
          />
          {imageFile && (
            <p className="text-sm text-gray-500">Selected: {imageFile.name}</p>
          )}
        </div>

        {}
        <button
          type="submit"
          className="w-full py-2 bg-green-500 text-white font-bold rounded-md"
          disabled={isLoading || isUploading}
        >
          {isLoading || isUploading ? (
            <span className="">{isUploading ? "Uploading Image..." : "Adding..."}</span>
          ) : (
            <span>Add Book</span>
          )}
        </button>
      </form>
    </div>
  );
};

export default AddBook;
