'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, X, Upload, Package } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface ProductForm {
  name: string;
  description: string;
  price: string;
  category: 'pizza' | 'boisson' | 'dessert' | 'accompagnement';
  ingredients: string[];
  available: boolean;
  popular: boolean;
  spicy: boolean;
  vegetarian: boolean;
  stock: string;
  minStock: string;
  image: string;
}

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [ingredientInput, setIngredientInput] = useState('');
  const [formData, setFormData] = useState<ProductForm>({
    name: '',
    description: '',
    price: '',
    category: 'pizza',
    ingredients: [],
    available: true,
    popular: false,
    spicy: false,
    vegetarian: false,
    stock: '100',
    minStock: '10',
    image: '/images/pizza-placeholder.jpg'
  });

  const handleAddIngredient = () => {
    if (ingredientInput.trim() && !formData.ingredients.includes(ingredientInput.trim())) {
      setFormData({
        ...formData,
        ingredients: [...formData.ingredients, ingredientInput.trim()]
      });
      setIngredientInput('');
    }
  };

  const handleRemoveIngredient = (index: number) => {
    setFormData({
      ...formData,
      ingredients: formData.ingredients.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock),
          minStock: parseInt(formData.minStock)
        })
      });

      if (response.ok) {
        toast.success('Produit ajouté avec succès !');
        router.push('/admin/products');
      } else {
        toast.error('Erreur lors de l\'ajout du produit');
      }
    } catch (error) {
      toast.error('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors font-semibold mb-6 group"
          >
            <ArrowLeft className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" />
            Retour aux produits
          </Link>
          <h1 className="text-4xl font-black text-gray-900 dark:text-gray-100 mb-2 transition-colors duration-300">Nouveau Produit</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 transition-colors duration-300">Ajoutez un nouveau produit à votre menu</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 space-y-8 transition-colors duration-300">
          {/* Basic Information */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-3 transition-colors duration-300">
              <div className="bg-primary-red/10 dark:bg-primary-red/20 p-2 rounded-xl transition-colors duration-300">
                <Package className="w-6 h-6 text-primary-red" />
              </div>
              Informations de base
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">
                  Nom du produit *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-red focus:border-primary-red bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-colors duration-300"
                  placeholder="Ex: Margherita"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">
                  Catégorie *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as ProductForm['category'] })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-red focus:border-primary-red bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors duration-300"
                >
                  <option value="pizza">Pizza</option>
                  <option value="boisson">Boisson</option>
                  <option value="dessert">Dessert</option>
                  <option value="accompagnement">Accompagnement</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-red focus:border-primary-red bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-colors duration-300"
                  placeholder="Description du produit..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">
                  Prix (€) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-red focus:border-primary-red bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-colors duration-300"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">
                  URL de l'image
                </label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-red focus:border-primary-red bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-colors duration-300"
                  placeholder="/images/pizzas/margherita.jpg"
                />
              </div>
            </div>
          </div>

          {/* Ingredients */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 transition-colors duration-300">Ingrédients</h2>

            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={ingredientInput}
                onChange={(e) => setIngredientInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddIngredient())}
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-red focus:border-primary-red bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-colors duration-300"
                placeholder="Ajouter un ingrédient..."
              />
              <button
                type="button"
                onClick={handleAddIngredient}
                className="px-6 py-3 bg-gray-900 dark:bg-gray-700 hover:bg-gray-800 dark:hover:bg-gray-600 text-white rounded-xl font-semibold transition-colors duration-300 flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Ajouter
              </button>
            </div>

            {formData.ingredients.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.ingredients.map((ingredient, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-xl transition-colors duration-300"
                  >
                    {ingredient}
                    <button
                      type="button"
                      onClick={() => handleRemoveIngredient(index)}
                      className="text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors duration-300"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Stock Management */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 transition-colors duration-300">Gestion du Stock</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">
                  Stock actuel
                </label>
                <input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-red focus:border-primary-red bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-colors duration-300"
                  placeholder="100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">
                  Stock minimum
                </label>
                <input
                  type="number"
                  value={formData.minStock}
                  onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-red focus:border-primary-red bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-colors duration-300"
                  placeholder="10"
                />
              </div>
            </div>
          </div>

          {/* Options */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 transition-colors duration-300">Options</h2>

            <div className="grid md:grid-cols-2 gap-4">
              <label className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.available}
                  onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                  className="w-5 h-5 text-primary-red focus:ring-primary-red rounded transition-colors duration-300"
                />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-300">Disponible</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">Le produit peut être commandé</p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.popular}
                  onChange={(e) => setFormData({ ...formData, popular: e.target.checked })}
                  className="w-5 h-5 text-primary-red focus:ring-primary-red rounded transition-colors duration-300"
                />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-300">Populaire</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">Mettre en avant ce produit</p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.spicy}
                  onChange={(e) => setFormData({ ...formData, spicy: e.target.checked })}
                  className="w-5 h-5 text-primary-red focus:ring-primary-red rounded transition-colors duration-300"
                />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-300">Épicé</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">Contient des épices</p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.vegetarian}
                  onChange={(e) => setFormData({ ...formData, vegetarian: e.target.checked })}
                  className="w-5 h-5 text-primary-red focus:ring-primary-red rounded transition-colors duration-300"
                />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-300">Végétarien</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">Convient aux végétariens</p>
                </div>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700 transition-colors duration-300">
            <Link
              href="/admin/products"
              className="px-6 py-3 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 font-semibold transition-colors duration-300"
            >
              Annuler
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-primary-red to-soft-red hover:from-primary-red-dark hover:to-primary-red text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? 'Ajout en cours...' : 'Ajouter le produit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}