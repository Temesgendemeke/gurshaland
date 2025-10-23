import React from "react";

const CategoryHeader = ({ currentCategory }:{currentCategory:{
  color: string;
  name: string;
  description: string;
}}) => {
  return (
    <div className="text-center mb-12">
      <div
        className={`inline-block p-4 rounded-2xl bg-gradient-to-r ${currentCategory.color} mb-6`}
      >
        <h1 className="text-4xl font-bold text-white">
          {currentCategory.name}
        </h1>
      </div>
      <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
        {currentCategory.description}
      </p>
    </div>
  );
};

export default CategoryHeader;
