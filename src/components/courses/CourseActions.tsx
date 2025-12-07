"use client";

import { useCart, CartItem } from '@/context/CartContext';
import { WishlistButton } from "@/components/ui/WishlistButton";
import type { CourseDetails } from "@/types/course";
import { useRouter } from 'next/navigation';
import { toast } from "sonner";

type CourseActionsProps = {
  course: Pick<
    CourseDetails,
    "slug" | "title" | "price" | "thumbnail" | "instructor" | "is_enrolled"
  >;
};

export function CourseActions({ course }: CourseActionsProps) {
  const { addToCart } = useCart();
  const router = useRouter();

  const handleAddToCart = () => {
    const coursePrice = parseFloat(course.price) || 0;

    const itemToAdd: CartItem = {
      type: 'course',
      slug: course.slug,
      title: course.title,
      instructor_name: course.instructor?.creator_name || 'Unknown Instructor',
      price: `KES ${course.price}`,
      priceValue: coursePrice,
      thumbnail: course.thumbnail,
    };

    addToCart(itemToAdd);

    toast.success(`${course.title} added to cart`);
  };

  // Main Enroll / Continue button logic
  const handleMainAction = () => {
    if (course.is_enrolled) {
      router.push(`/course-learning/${course.slug}`);
    } else {
      handleAddToCart();

      router.push('/cart');
    }
  };

  return (
    <>
      <button
        onClick={handleMainAction}
        className="w-full bg-[#2694C6] text-white font-bold py-3 px-4 rounded hover:bg-[#1f7ba5] transition-colors duration-200 mb-3"
      >
        {course.is_enrolled ? 'Continue Learning' : 'Enroll Now'}
      </button>

      {!course.is_enrolled && (
        <div className="flex items-center space-x-3">
          <button
            onClick={handleAddToCart}
            className="flex-grow bg-white text-gray-900 font-bold py-3 px-4 rounded border-2 border-gray-800 hover:bg-gray-100 transition-colors duration-200"
          >
            Add to Cart
          </button>

          <WishlistButton slug={course.slug} type="course" />
        </div>
      )}
    </>
  );
}
