import React, { useState, useEffect } from 'react';

interface Product {
  url: string;
  user_note: string;
  target_price: number;
  selector: string;
  price: number;
  price_timestamp: string;
}

export const TrackingHistory: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/price/getProductInfo');
        if (!response.ok) throw new Error('Network response was not ok.');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        setError('Failed to fetch data');
        console.error(error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div>
      <h1>Product Information</h1>
      {error && <p>{error}</p>}
      <table>
        <thead>
          <tr>
            <th>URL</th>
            <th>User Note</th>
            <th>Target Price</th>
            <th>Selector</th>
            <th>Price</th>
            <th>Price Timestamp</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={index}>
              <td>{product.url}</td>
              <td>{product.user_note}</td>
              <td>{product.target_price}</td>
              <td>{product.selector}</td>
              <td>{product.price}</td>
              <td>{product.price_timestamp}</td>
              <td>{/* Edit and Delete buttons will go here */}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// // Continued from the previous code

// // Edit functionality using inline editing
// const handleEditChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number, field: keyof Product) => {
//     const newProducts = [...products];
//     newProducts[index] = { ...newProducts[index], [field]: event.target.value };
//     setProducts(newProducts);
// };

// // Save the edited data
// const handleSave = async (index: number) => {
//     try {
//         const product = products[index];
//         const response = await fetch('/api/price/updateProductInfo', {
//             method: 'PUT',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify(product)
//         });
//         if (!response.ok) throw new Error('Failed to save data');
//         alert('Product updated successfully!');
//     } catch (error) {
//         console.error('Error updating product:', error);
//     }
// };

// // Delete functionality
// const handleDelete = async (url: string) => {
//     try {
//         const response = await fetch('/api/price/deleteProduct', {
//             method: 'DELETE',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ url })
//         });
//         if (!response.ok) throw new Error('Failed to delete product');
//         setProducts(products.filter(product => product.url !== url));
//         alert('Product deleted successfully!');
//     } catch (error) {
//         console.error('Error deleting product:', error);
//     }
// };

// // Include editable inputs and buttons in the table
// // Continued from the previous code inside <tbody>...
// <td>
//     <input type="text" value={product.user_note} onChange={e => handleEditChange(e, index, 'user_note')} />
// </td>
// <td>
//     <input type="number" value={product.target_price} onChange={e => handleEditChange(e, index, 'target_price')} />
// </td>
// {/* Other fields remain unchanged */}
// <td>
//     <button onClick={() => handleSave(index)}>Save</button>
//     <button onClick={() => handleDelete(product.url)}>Delete</button>
// </td>
