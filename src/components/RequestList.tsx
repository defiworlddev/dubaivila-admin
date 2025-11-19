import { useState, useEffect } from 'react';
import { requestService, EstateRequest } from '../service/requestService';

// Import property type images
import villaImage from '../assets/villa.webp';
import apartmentImage from '../assets/apartment.webp';
import officeImage from '../assets/office.webp';
import storeImage from '../assets/store.webp';
import otherImage from '../assets/other.webp';

const statusColors = {
  pending: 'bg-accent-100 text-accent-800',
  in_progress: 'bg-primary-100 text-primary-800',
  completed: 'bg-green-100 text-green-800',
};

const statusLabels = {
  pending: 'Pending',
  in_progress: 'In Progress',
  completed: 'Completed',
};

const getPropertyImage = (propertyType: string): string => {
  const type = propertyType.toLowerCase();
  if (type === 'villa') return villaImage;
  if (type === 'apartment') return apartmentImage;
  if (type === 'office') return officeImage;
  if (type === 'store' || type === 'retail store') return storeImage;
  return otherImage;
};

export const RequestList = () => {
  const [requests, setRequests] = useState<EstateRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingIds, setUpdatingIds] = useState<Set<string>>(new Set());
  const [searchId, setSearchId] = useState('');

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    setIsLoading(true);
    setError('');
    try {
      const allRequests = await requestService.getAllRequests();
      setRequests(allRequests);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load requests');
      console.error('Failed to load requests:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (requestId: string, newStatus: EstateRequest['status']) => {
    setUpdatingIds((prev) => new Set(prev).add(requestId));
    try {
      const updatedRequest = await requestService.updateRequestStatus(requestId, newStatus);
      setRequests((prevRequests) =>
        prevRequests.map((req) => (req.id === requestId ? updatedRequest : req))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update request status');
      console.error('Failed to update request status:', err);
    } finally {
      setUpdatingIds((prev) => {
        const next = new Set(prev);
        next.delete(requestId);
        return next;
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-primary-600 font-medium">Loading requests...</div>
      </div>
    );
  }

  if (error && requests.length === 0) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        {error}
      </div>
    );
  }

  const filteredRequests = searchId
    ? requests.filter((request) =>
        request.id.toLowerCase().includes(searchId.toLowerCase())
      )
    : requests;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-primary-900">All Requests</h2>
        <button
          onClick={loadRequests}
          className="bg-primary-700 text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-800 transition-colors"
        >
          Refresh
        </button>
      </div>

      <div className="bg-white rounded-lg border border-primary-200 p-4">
        <div className="flex items-center gap-3">
          <svg
            className="w-5 h-5 text-primary-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search by Request ID..."
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            className="flex-1 outline-none text-primary-900 placeholder-primary-400"
          />
          {searchId && (
            <button
              onClick={() => setSearchId('')}
              className="text-primary-500 hover:text-primary-700 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {filteredRequests.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-primary-200 p-12 text-center">
          <p className="text-primary-700 font-medium">
            {searchId ? 'No requests found matching the search ID.' : 'No requests found.'}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredRequests.map((request) => (
            <div
              key={request.id}
              className="bg-white rounded-lg border border-primary-200 hover:border-primary-300 hover:shadow-md transition-all overflow-hidden"
            >
              <div className="flex">
                {/* Image */}
                <div className="relative w-32 h-32 flex-shrink-0 bg-primary-50">
                  <img
                    src={getPropertyImage(request.propertyType)}
                    alt={request.propertyType}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-bold text-primary-900 mb-1">
                          {request.location}
                        </h3>
                        <p className="text-sm text-primary-600 font-medium">
                          {request.propertyType}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <select
                          value={request.status}
                          onChange={(e) =>
                            handleStatusUpdate(
                              request.id,
                              e.target.value as EstateRequest['status']
                            )
                          }
                          disabled={updatingIds.has(request.id)}
                          className={`
                            px-2.5 py-1 rounded text-xs font-semibold border-0 outline-none cursor-pointer
                            ${statusColors[request.status]}
                            disabled:opacity-50 disabled:cursor-not-allowed
                          `}
                        >
                          <option value="pending">Pending</option>
                          <option value="in_progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 mt-3">
                      <div className="flex items-center gap-1.5">
                        <svg
                          className="w-4 h-4 text-primary-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span className="text-sm font-semibold text-primary-900">
                          {request.budget}
                        </span>
                      </div>
                      {request.bedrooms && (
                        <div className="text-sm text-primary-600">
                          {request.bedrooms} Bedrooms
                        </div>
                      )}
                      {request.bathrooms && (
                        <div className="text-sm text-primary-600">
                          {request.bathrooms} Bathrooms
                        </div>
                      )}
                    </div>

                    {request.additionalRequirements && (
                      <div className="mt-3 text-sm text-primary-600">
                        <span className="font-semibold">Requirements: </span>
                        {request.additionalRequirements}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

