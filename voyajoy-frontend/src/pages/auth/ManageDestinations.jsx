import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import destinationService from '../../services/destinationService';
import ErrorHandler from '../../services/ErrorHandler';

const ManageDestinations = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    destinationName: '',
    location: '',
    description: '',
    totalBudget: '',
    advancePayment: '',
    image: '',
    itinerary: ''
  });

  useEffect(() => {
    if (!user || user.role !== 'MANAGER') {
      alert('Access denied. Manager login required.');
      navigate('/login');
      return;
    }
    fetchDestinations();
  }, [user, navigate]);

  const fetchDestinations = async () => {
    try {
      setLoading(true);
      const response = await destinationService.getAllDestinations();
      setDestinations(response.data);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      destinationName: '',
      location: '',
      description: '',
      totalBudget: '',
      advancePayment: '',
      image: '',
      itinerary: ''
    });
    setSelectedDestination(null);
  };

  const openAddModal = () => {
    resetForm();
    setModalMode('add');
    setShowModal(true);
  };

  const openEditModal = (destination) => {
    setSelectedDestination(destination);
    setFormData({
      destinationName: destination.destinationName,
      location: destination.location,
      description: destination.description,
      totalBudget: destination.totalBudget,
      advancePayment: destination.advancePayment,
      image: destination.image,
      itinerary: destination.itinerary
    });
    setModalMode('edit');
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (parseFloat(formData.advancePayment) > parseFloat(formData.totalBudget)) {
      alert('Advance payment cannot exceed total budget');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      if (modalMode === 'add') {
        await destinationService.addDestination(formData);
        alert('Destination added successfully!');
      } else {
        await destinationService.updateDestination(selectedDestination.destinatonId, formData);
        alert('Destination updated successfully!');
      }

      setShowModal(false);
      resetForm();
      fetchDestinations();
    } catch (err) {
      setError(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      await destinationService.deleteDestination(id);
      alert('Destination deleted successfully!');
      fetchDestinations();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete destination');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-purple-50 to-pink-50">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Loading destinations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-purple-50 via-pink-50 to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8 bg-linear-to-r from-purple-600 via-pink-500 to-pink-600 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl animate-pulse"></div>
          </div>
          
          <div className="relative z-10 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">🌍 Manage Destinations</h1>
              <p className="text-pink-100 text-lg">Add, edit, or remove travel packages</p>
            </div>
            <button
              onClick={openAddModal}
              className="bg-white text-purple-700 px-6 py-3 rounded-full font-bold hover:bg-pink-50 transition shadow-lg hover:shadow-xl transform hover:scale-105 whitespace-nowrap"
            >
              ➕ Add New Destination
            </button>
          </div>
        </div>

        <ErrorHandler error={error} onClose={() => setError(null)} />

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-xl border-2 border-pink-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">Total Destinations</p>
                <p className="text-4xl font-bold text-purple-600">{destinations.length}</p>
              </div>
              <span className="text-5xl">🎯</span>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-xl border-2 border-pink-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">Avg. Package Price</p>
                <p className="text-4xl font-bold text-green-600">
                  ₹{destinations.length > 0 ? Math.round(destinations.reduce((sum, d) => sum + d.totalBudget, 0) / destinations.length) : 0}
                </p>
              </div>
              <span className="text-5xl">💰</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-xl border-2 border-pink-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">Locations</p>
                <p className="text-4xl font-bold text-pink-600">
                  {new Set(destinations.map(d => d.location)).size}
                </p>
              </div>
              <span className="text-5xl">📍</span>
            </div>
          </div>
        </div>

        {/* Destinations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((destination) => (
            <div key={destination.destinatonId} className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition transform hover:scale-105 border-2 border-pink-100">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={destination.image}
                  alt={destination.destinationName}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-purple-900/60 to-transparent"></div>
                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="text-white font-bold text-xl truncate">{destination.destinationName}</h3>
                  <p className="text-pink-200 text-sm">📍 {destination.location}</p>
                </div>
              </div>

              <div className="p-5">
                <p className="text-gray-600 text-sm line-clamp-2 mb-4">{destination.description}</p>
                
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div>
                    <p className="text-xs text-gray-500">Total Budget</p>
                    <p className="font-bold text-gray-800">₹{destination.totalBudget}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Advance</p>
                    <p className="font-bold text-green-600">₹{destination.advancePayment}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => openEditModal(destination)}
                    className="bg-linear-to-r from-purple-600 to-pink-600 text-white py-2 rounded-xl hover:from-purple-700 hover:to-pink-700 font-semibold transition shadow-md hover:shadow-lg text-sm"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(destination.destinatonId, destination.destinationName)}
                    className="bg-red-600 text-white py-2 rounded-xl hover:bg-red-700 font-semibold transition shadow-md hover:shadow-lg text-sm"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {destinations.length === 0 && !loading && (
          <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-pink-300">
            <div className="text-6xl mb-4">🌍</div>
            <p className="text-gray-700 text-lg font-semibold mb-2">No destinations yet</p>
            <p className="text-gray-600 mb-6">Start by adding your first destination</p>
            <button
              onClick={openAddModal}
              className="bg-linear-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-full font-bold hover:from-purple-700 hover:to-pink-700 transition shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              ➕ Add First Destination
            </button>
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full my-8 border-2 border-pink-200">
              <div className="bg-linear-to-r from-purple-600 to-pink-600 p-6 rounded-t-2xl">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-white">
                    {modalMode === 'add' ? '➕ Add New Destination' : '✏️ Edit Destination'}
                  </h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-white text-3xl hover:opacity-70 transition"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Destination Name *</label>
                  <input
                    type="text"
                    name="destinationName"
                    value={formData.destinationName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="e.g., Goa Beach Paradise"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Location *</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="e.g., Goa, India"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows="3"
                    className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                    placeholder="Brief description of the destination..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Total Budget (₹) *</label>
                    <input
                      type="number"
                      name="totalBudget"
                      value={formData.totalBudget}
                      onChange={handleChange}
                      required
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="10000"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Advance Payment (₹) *</label>
                    <input
                      type="number"
                      name="advancePayment"
                      value={formData.advancePayment}
                      onChange={handleChange}
                      required
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="3000"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Image URL *</label>
                  <input
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Itinerary *</label>
                  <textarea
                    name="itinerary"
                    value={formData.itinerary}
                    onChange={handleChange}
                    required
                    rows="6"
                    className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                    placeholder="Day 1: Arrival and check-in&#10;Day 2: Beach activities&#10;Day 3: Departure"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="bg-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-400 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="bg-linear-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 transition shadow-lg"
                  >
                    {submitting ? 'Saving...' : modalMode === 'add' ? '➕ Add Destination' : '💾 Save Changes'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageDestinations;