const CategoryTree = ({ category }) => {
  return (
    <div className="category">
      <p>{category.title}</p>
      {category.children && category.children.length > 0 && (
        <div className="children">
          {category.children.map((child) => (
            <CategoryTreeNode key={child.id} category={child} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryTree;
