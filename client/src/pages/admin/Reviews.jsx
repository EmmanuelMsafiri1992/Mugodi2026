import { useEffect, useState } from 'react';
import {
  Star,
  Search,
  Trash2,
  Check,
  X,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Filter
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import Pagination from '../../components/admin/Pagination';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalReviews, setTotalReviews] = useState(0);
  const [selectedReview, setSelectedReview] = useState(null);

  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      // In a real app, this would fetch from the API
      // For now, using mock data
      const mockReviews = [
        {
          _id: '1',
          product: { _id: 'p1', name: 'Fresh Tomatoes', thumbnail: 'https://via.placeholder.com/60' },
          user: { _id: 'u1', name: 'John Doe', email: 'john@example.com' },
          rating: 5,
          comment: 'Excellent quality! Very fresh and tasty. Will definitely order again.',
          isApproved: true,
          createdAt: new Date(Date.now() - 86400000).toISOString()
        },
        {
          _id: '2',
          product: { _id: 'p2', name: 'Organic Bananas', thumbnail: 'https://via.placeholder.com/60' },
          user: { _id: 'u2', name: 'Jane Smith', email: 'jane@example.com' },
          rating: 4,
          comment: 'Good quality bananas. A bit smaller than expected but taste great.',
          isApproved: true,
          createdAt: new Date(Date.now() - 172800000).toISOString()
        },
        {
          _id: '3',
          product: { _id: 'p3', name: 'Brown Rice 2kg', thumbnail: 'https://via.placeholder.com/60' },
          user: { _id: 'u3', name: 'Mike Wilson', email: 'mike@example.com' },
          rating: 3,
          comment: 'Average quality. Packaging could be better.',
          isApproved: false,
          createdAt: new Date(Date.now() - 259200000).toISOString()
        },
        {
          _id: '4',
          product: { _id: 'p1', name: 'Fresh Tomatoes', thumbnail: 'https://via.placeholder.com/60' },
          user: { _id: 'u4', name: 'Sarah Johnson', email: 'sarah@example.com' },
          rating: 2,
          comment: 'Some tomatoes were overripe. Disappointed with the quality.',
          isApproved: true,
          createdAt: new Date(Date.now() - 345600000).toISOString()
        },
        {
          _id: '5',
          product: { _id: 'p4', name: 'Fresh Milk 1L', thumbnail: 'https://via.placeholder.com/60' },
          user: { _id: 'u5', name: 'Peter Brown', email: 'peter@example.com' },
          rating: 5,
          comment: 'Best milk in town! Always fresh and delivered on time.',
          isApproved: true,
          createdAt: new Date(Date.now() - 432000000).toISOString()
        }
      ];

      let filtered = mockReviews;

      if (ratingFilter) {
        filtered = filtered.filter(r => r.rating === parseInt(ratingFilter));
      }

      if (statusFilter === 'approved') {
        filtered = filtered.filter(r => r.isApproved);
      } else if (statusFilter === 'pending') {
        filtered = filtered.filter(r => !r.isApproved);
      }

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(r =>
          r.product.name.toLowerCase().includes(query) ||
          r.user.name.toLowerCase().includes(query) ||
          r.comment.toLowerCase().includes(query)
        );
      }

      setReviews(filtered);
      setTotalReviews(filtered.length);
      setTotalPages(Math.ceil(filtered.length / 10));
    } catch (error) {
      toast.error('Failed to fetch reviews');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [ratingFilter, statusFilter, currentPage]);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchReviews();
  };

  const handleApprove = async (reviewId) => {
    setReviews(reviews.map(r =>
      r._id === reviewId ? { ...r, isApproved: true } : r
    ));
    toast.success('Review approved');
  };

  const handleReject = async (reviewId) => {
    setReviews(reviews.map(r =>
      r._id === reviewId ? { ...r, isApproved: false } : r
    ));
    toast.success('Review rejected');
  };

  const handleDelete = async (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      setReviews(reviews.filter(r => r._id !== reviewId));
      toast.success('Review deleted');
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-MW', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, r) => sum + r.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(r => distribution[r.rating]++);
    return distribution;
  };

  const distribution = getRatingDistribution();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reviews</h1>
        <p className="text-gray-500">Manage customer reviews</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{getAverageRating()}</p>
              <p className="text-sm text-gray-500">Average Rating</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{totalReviews}</p>
              <p className="text-sm text-gray-500">Total Reviews</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <ThumbsUp className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {reviews.filter(r => r.rating >= 4).length}
              </p>
              <p className="text-sm text-gray-500">Positive Reviews</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <ThumbsDown className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {reviews.filter(r => !r.isApproved).length}
              </p>
              <p className="text-sm text-gray-500">Pending Approval</p>
            </div>
          </div>
        </div>
      </div>

      {/* Rating Distribution */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Rating Distribution</h2>
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center gap-3">
              <div className="flex items-center gap-1 w-20">
                <span className="text-sm font-medium">{rating}</span>
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              </div>
              <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400 rounded-full"
                  style={{
                    width: `${totalReviews > 0 ? (distribution[rating] / totalReviews) * 100 : 0}%`
                  }}
                />
              </div>
              <span className="text-sm text-gray-500 w-16 text-right">
                {distribution[rating]} ({totalReviews > 0 ? Math.round((distribution[rating] / totalReviews) * 100) : 0}%)
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by product, user, or comment..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All Status</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
          </select>
          <button
            onClick={handleSearch}
            className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
          >
            Search
          </button>
        </div>
      </div>

      {/* Reviews List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500" />
          </div>
        ) : reviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <MessageSquare className="w-12 h-12 mb-4" />
            <p>No reviews found</p>
          </div>
        ) : (
          <div className="divide-y">
            {reviews.map((review) => (
              <div key={review._id} className="p-4 hover:bg-gray-50">
                <div className="flex items-start gap-4">
                  <img
                    src={review.product.thumbnail}
                    alt={review.product.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-medium text-gray-900">{review.product.name}</h3>
                        <p className="text-sm text-gray-500">
                          by {review.user.name} ({review.user.email})
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {!review.isApproved && (
                          <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded-full">
                            Pending
                          </span>
                        )}
                        {renderStars(review.rating)}
                      </div>
                    </div>
                    <p className="text-gray-600 mt-2">{review.comment}</p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs text-gray-500">
                        {formatDate(review.createdAt)}
                      </span>
                      <div className="flex items-center gap-2">
                        {!review.isApproved && (
                          <button
                            onClick={() => handleApprove(review._id)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                            title="Approve"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        {review.isApproved && (
                          <button
                            onClick={() => handleReject(review._id)}
                            className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg"
                            title="Unapprove"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(review._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalReviews}
            itemsPerPage={10}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
};

export default Reviews;
