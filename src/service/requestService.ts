import { api } from './api';

export interface EstateRequest {
  id: string;
  userId: string;
  category: string;
  buyOrRent: string;
  budget: string;
  area: string;
  bed?: string;
  size?: string;
  additionalInfo?: string;
  status: 'New Request' | 'Receiving Offers' | 'Deal Closed 💯';
  createdAt: string;
}

interface ServerEstateRequest {
  _id: string;
  userId: string;
  category: string;
  buyOrRent: string;
  budget: string;
  area: string;
  bed?: string;
  size?: string;
  additionalInfo?: string;
  status: 'New Request' | 'Receiving Offers' | 'Deal Closed 💯';
  createdAt: string;
}

class RequestService {
  private convertServerRequest(serverRequest: ServerEstateRequest): EstateRequest {
    return {
      id: serverRequest._id,
      userId: serverRequest.userId,
      category: serverRequest.category,
      buyOrRent: serverRequest.buyOrRent,
      budget: serverRequest.budget,
      area: serverRequest.area,
      bed: serverRequest.bed,
      size: serverRequest.size,
      additionalInfo: serverRequest.additionalInfo,
      status: serverRequest.status,
      createdAt: serverRequest.createdAt,
    };
  }

  async getAllRequests(): Promise<EstateRequest[]> {
    const response = await api.get<{ requests: ServerEstateRequest[] }>(
      '/api/estate/requests'
    );
    return response.requests.map((req) => this.convertServerRequest(req));
  }

  async updateRequestStatus(
    requestId: string,
    status: EstateRequest['status']
  ): Promise<EstateRequest> {
    const response = await api.patch<{ request: ServerEstateRequest }>(
      `/api/estate/requests/${requestId}/status`,
      { status }
    );
    return this.convertServerRequest(response.request);
  }

  async deleteRequest(requestId: string): Promise<void> {
    await api.delete(`/api/admin/requests/${requestId}`);
  }
}

export const requestService = new RequestService();

