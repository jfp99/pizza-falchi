'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  Plus, Edit, Trash2, Search, Filter, Pizza, CupSoda,
  AlertTriangle, Package, TrendingDown, CheckCircle,
  Coffee, Cake, Utensils
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  ingredients: string[];
  available: boolean;
  popular?: boolean;
  spicy?: boolean;
  vegetarian?: boolean;
  tags?: string[];
  stock?: number;
  minStock?: number;
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session || session.user.role !== 'admin') {
      router.push('/auth/signin');
      return;
    }
    
    fetchProducts();
  }, [session, status, router]);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, selectedCategory]);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      toast.error('Erreur lors du chargement des produits');
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    setFilteredProducts(filtered);
  };

  const deleteProduct = async (productId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) return;

    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        toast.success('Produit supprimé avec succès');
        fetchProducts();
      } else {
        toast.error('Erreur lors de la suppression');
      }
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const toggleAvailability = async (product: Product) => {
    try {
      const res = await fetch(`/api/products/${product._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...product,
          available: !product.available
        }),
      });

      if (res.ok) {
        toast.success(`Produit ${!product.available ? 'activé' : 'désactivé'}`);
        fetchProducts();
      } else {
        toast.error('Erreur lors de la modification');
      }
    } catch (error) {
      toast.error('Erreur lors de la modification');
    }
  };

  const handleUpdateStock = async (productId: string, newStock: number) => {
    try {
      const product = products.find(p => p._id === productId);
      if (!product) return;

      const res = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...product, stock: newStock })
      });

      if (res.ok) {
        toast.success('Stock mis à jour');
        fetchProducts();
      }
    } catch (error) {
      toast.error('Erreur lors de la mise à jour du stock');
    }
  };

  const getStockStatus = (product: Product) => {
    const stock = product.stock || 0;
    const minStock = product.minStock || 10;

    if (stock === 0) return { label: 'Rupture', color: 'text-red-600', bgColor: 'bg-red-50' };
    if (stock <= minStock) return { label: 'Faible', color: 'text-yellow-600', bgColor: 'bg-yellow-50' };
    return { label: 'Bon', color: 'text-green-600', bgColor: 'bg-green-50' };
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'pizza': return <Pizza className="w-5 h-5" />;
      case 'boisson': return <Coffee className="w-5 h-5" />;
      case 'dessert': return <Cake className="w-5 h-5" />;
      case 'accompagnement': return <Utensils className="w-5 h-5" />;
      default: return <Pizza className="w-5 h-5" />;
    }
  };

  const categories = [
    { id: 'all', name: 'Tous les produits' },
    { id: 'pizza', name: 'Pizzas' },
    { id: 'boisson', name: 'Boissons' },
    { id: 'dessert', name: 'Desserts' },
    { id: 'accompagnement', name: 'Accompagnements' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#E30613]"></div>
      </div>
    );
  }

  const stats = {
    total: products.length,
    available: products.filter(p => p.available).length,
    lowStock: products.filter(p => (p.stock || 0) <= (p.minStock || 10) && (p.stock || 0) > 0).length,
    outOfStock: products.filter(p => (p.stock || 0) === 0).length
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Produits</h1>
          <p className="text-gray-600">Gérez le menu de votre restaurant</p>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <Package className="w-10 h-10 text-primary-red" />
              <span className="text-3xl font-bold text-gray-900">{stats.total}</span>
            </div>
            <p className="text-gray-600 font-medium">Total Produits</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
              <span className="text-3xl font-bold text-gray-900">{stats.available}</span>
            </div>
            <p className="text-gray-600 font-medium">Disponibles</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <AlertTriangle className="w-10 h-10 text-yellow-600" />
              <span className="text-3xl font-bold text-gray-900">{stats.lowStock}</span>
            </div>
            <p className="text-gray-600 font-medium">Stock Faible</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <TrendingDown className="w-10 h-10 text-red-600" />
              <span className="text-3xl font-bold text-gray-900">{stats.outOfStock}</span>
            </div>
            <p className="text-gray-600 font-medium">Rupture Stock</p>
          </div>
        </div>

        {/* Barre d'actions */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 justify-between items-center">
            <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full">
              {/* Recherche */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Rechercher un produit..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-transparent"
                />
              </div>

              {/* Filtres */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Bouton Ajouter */}
            <button
              onClick={() => {
                setEditingProduct(null);
                setIsModalOpen(true);
              }}
              className="bg-[#E30613] text-white px-6 py-2 rounded-lg hover:bg-[#c10510] transition flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Ajouter un produit</span>
            </button>
          </div>
        </div>

        {/* Grille des produits */}
        <div className="grid gap-6">
          {filteredProducts.map(product => (
            <div key={product._id} className="bg-white rounded-lg shadow hover:shadow-md transition">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <img
                      src={product.image || '/images/pizza-placeholder.jpg'}
                      alt={`${product.name} - ${product.description}`}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{product.name}</h3>
                        <div className="flex items-center space-x-2">
                          {getCategoryIcon(product.category)}
                          <span className="text-sm text-gray-500 capitalize">{product.category}</span>
                        </div>
                      </div>
                      <p className="text-gray-600 mb-2">{product.description}</p>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {product.ingredients.map(ingredient => (
                          <span key={ingredient} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                            {ingredient}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center space-x-4 mb-3">
                        <span className="text-2xl font-bold text-[#E30613]">{product.price}€</span>
                        {product.popular && (
                          <span className="bg-[#FFD200] text-black px-2 py-1 rounded text-xs font-bold">
                            Populaire
                          </span>
                        )}
                        {product.spicy && (
                          <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">
                            Épicé
                          </span>
                        )}
                        {product.vegetarian && (
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                            Végétarien
                          </span>
                        )}
                      </div>

                      {/* Stock Information */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <label className="text-sm font-medium text-gray-700">Stock:</label>
                          <input
                            type="number"
                            min="0"
                            value={product.stock || 0}
                            onChange={(e) => handleUpdateStock(product._id, parseInt(e.target.value) || 0)}
                            className={`w-20 px-2 py-1 border rounded-lg text-sm font-semibold focus:ring-2 focus:ring-[#E30613] ${
                              (product.stock || 0) === 0
                                ? 'border-red-300 bg-red-50 text-red-700'
                                : (product.stock || 0) <= (product.minStock || 10)
                                ? 'border-yellow-300 bg-yellow-50 text-yellow-700'
                                : 'border-gray-300 bg-white text-gray-900'
                            }`}
                          />
                          <span className="text-sm text-gray-500">/ {product.minStock || 10}</span>
                        </div>

                        {(() => {
                          const status = getStockStatus(product);
                          return (
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-sm font-medium ${status.bgColor} ${status.color}`}>
                              {(product.stock || 0) === 0 ? (
                                <TrendingDown className="w-4 h-4" />
                              ) : (product.stock || 0) <= (product.minStock || 10) ? (
                                <AlertTriangle className="w-4 h-4" />
                              ) : (
                                <CheckCircle className="w-4 h-4" />
                              )}
                              {status.label}
                            </span>
                          );
                        })()}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {/* Bouton Disponibilité */}
                    <button
                      onClick={() => toggleAvailability(product)}
                      className={`px-3 py-1 rounded text-sm font-medium ${
                        product.available 
                          ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                      }`}
                    >
                      {product.available ? 'Disponible' : 'Indisponible'}
                    </button>

                    {/* Bouton Modifier */}
                    <button
                      onClick={() => {
                        setEditingProduct(product);
                        setIsModalOpen(true);
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded transition"
                    >
                      <Edit className="w-5 h-5" />
                    </button>

                    {/* Bouton Supprimer */}
                    <button
                      onClick={() => deleteProduct(product._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Message si aucun produit */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <div className="text-6xl mb-4">🍕</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Aucun produit trouvé</h3>
            <p className="text-gray-600">Essayez de modifier vos critères de recherche ou ajoutez un nouveau produit</p>
          </div>
        )}

        {/* Modal d'ajout/modification */}
        {isModalOpen && (
          <ProductModal
            product={editingProduct}
            onClose={() => {
              setIsModalOpen(false);
              setEditingProduct(null);
            }}
            onSave={() => {
              setIsModalOpen(false);
              setEditingProduct(null);
              fetchProducts();
            }}
          />
        )}
      </div>
    </div>
  );
}

// Composant Modal pour ajouter/modifier un produit
function ProductModal({ product, onClose, onSave }: { 
  product: Product | null; 
  onClose: () => void; 
  onSave: () => void;
}) {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || 0,
    category: product?.category || 'pizza',
    image: product?.image || '',
    ingredients: product?.ingredients.join(', ') || '',
    available: product?.available ?? true,
    popular: product?.popular ?? false,
    spicy: product?.spicy ?? false,
    vegetarian: product?.vegetarian ?? false,
    tags: product?.tags?.join(', ') || '',
    stock: product?.stock || 100,
    minStock: product?.minStock || 10,
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productData = {
        ...formData,
        ingredients: formData.ingredients.split(',').map(ing => ing.trim()).filter(ing => ing),
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        price: parseFloat(formData.price.toString()),
        stock: parseInt(formData.stock.toString()) || 100,
        minStock: parseInt(formData.minStock.toString()) || 10
      };

      const url = product ? `/api/products/${product._id}` : '/api/products';
      const method = product ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (res.ok) {
        toast.success(product ? 'Produit modifié avec succès' : 'Produit ajouté avec succès');
        onSave();
      } else {
        toast.error('Erreur lors de la sauvegarde');
      }
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">
            {product ? 'Modifier le produit' : 'Ajouter un produit'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prix (€) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Catégorie *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-transparent"
                >
                  <option value="pizza">Pizza</option>
                  <option value="boisson">Boisson</option>
                  <option value="dessert">Dessert</option>
                  <option value="accompagnement">Accompagnement</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ingrédients (séparés par des virgules)
              </label>
              <input
                type="text"
                value={formData.ingredients}
                onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
                placeholder="sauce tomate, mozzarella, basilic..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tags (séparés par des virgules)
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="classique, végétarienne, épicée..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stock actuel
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-transparent"
                  placeholder="100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stock minimum (seuil d'alerte)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.minStock}
                  onChange={(e) => setFormData({ ...formData, minStock: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-transparent"
                  placeholder="10"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.available}
                  onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                  className="rounded border-gray-300 text-[#E30613] focus:ring-[#E30613]"
                />
                <span className="text-sm text-gray-700">Disponible</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.popular}
                  onChange={(e) => setFormData({ ...formData, popular: e.target.checked })}
                  className="rounded border-gray-300 text-[#E30613] focus:ring-[#E30613]"
                />
                <span className="text-sm text-gray-700">Populaire</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.spicy}
                  onChange={(e) => setFormData({ ...formData, spicy: e.target.checked })}
                  className="rounded border-gray-300 text-[#E30613] focus:ring-[#E30613]"
                />
                <span className="text-sm text-gray-700">Épicé</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.vegetarian}
                  onChange={(e) => setFormData({ ...formData, vegetarian: e.target.checked })}
                  className="rounded border-gray-300 text-[#E30613] focus:ring-[#E30613]"
                />
                <span className="text-sm text-gray-700">Végétarien</span>
              </label>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-[#E30613] text-white px-4 py-2 rounded-lg hover:bg-[#c10510] transition disabled:opacity-50"
              >
                {loading ? 'Sauvegarde...' : (product ? 'Modifier' : 'Ajouter')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}