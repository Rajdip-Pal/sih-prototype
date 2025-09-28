// API Service for AgriTrace Frontend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export class AgriTraceAPI {
    private static baseURL = API_BASE_URL;

    // Helper method for making API requests
    private static async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
        const url = `${this.baseURL}${endpoint}`;

        try {
            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options?.headers,
                },
                ...options,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error(`API request failed for ${endpoint}:`, error);
            throw error;
        }
    }

    // Farmers API
    static async getAllFarmers() {
        return this.request<{
            success: boolean;
            count: number;
            farmers: Farmer[];
        }>('/api/farmers');
    }

    static async getFarmerById(farmerId: string) {
        return this.request<{
            success: boolean;
            farmer: Farmer;
        }>(`/api/farmers/${farmerId}`);
    }

    // Products API
    static async getAllProducts() {
        return this.request<{
            success: boolean;
            count: number;
            products: Product[];
        }>('/api/products');
    }

    // Traceability API
    static async traceProduct(productId: string) {
        return this.request<{
            success: boolean;
            trace: {
                product: Product;
                farmer: Farmer;
                supplyChain: SupplyChainEvent[];
                totalStages: number;
            };
        }>(`/api/trace/${productId}`);
    }

    static async getBlockchainTrace(productId: string) {
        return this.request<{
            success: boolean;
            productId: string;
            blockchainTrace: BlockchainBlock[];
        }>(`/api/blockchain-trace/${productId}`);
    }

    // Supply Chain API
    static async addSupplyChainEvent(event: Omit<SupplyChainEvent, 'timestamp'>) {
        return this.request<{
            success: boolean;
            message: string;
            txHash: string;
            event: SupplyChainEvent;
        }>('/api/supply-chain-event', {
            method: 'POST',
            body: JSON.stringify(event),
        });
    }

    // Dashboard API
    static async getDashboardStats() {
        return this.request<{
            success: boolean;
            stats: {
                totalFarmers: number;
                totalProducts: number;
                totalSupplyChainEvents: number;
                organicProducts: number;
                recentEvents: SupplyChainEvent[];
                productsByLocation: Record<string, number>;
            };
        }>('/api/dashboard/stats');
    }

    // QR Code API
    static async generateQR(productId: string) {
        return this.request<{
            success: boolean;
            productId: string;
            qrData: string;
            message: string;
        }>(`/api/qr/${productId}`);
    }

    // Blockchain API
    static async getFullChain() {
        return this.request<{
            message: string;
            blocks: BlockchainBlock[];
        }>('/fullchain');
    }

    static async addBlock(parentIndex: number, data: any) {
        return this.request<{
            message: string;
            txHash: string;
            latestIndex: string;
            parentIndex: number;
            storedData: any;
        }>('/store', {
            method: 'POST',
            body: JSON.stringify({ parentIndex, data }),
        });
    }
}

// Type definitions
export interface Farmer {
    farmerId: string;
    name: string;
    location: string;
    crops: string[];
    farmSize: string;
    certification: string;
    contactInfo: string;
    village?: string;
    district?: string;
    state?: string;
}

export interface Product {
    productId: string;
    name: string;
    variety: string;
    farmerId: string;
    plantingDate: string;
    harvestDate: string;
    quantity: string;
    qualityGrade: string;
    certifications: string[];
    location: string;
    district?: string;
    state?: string;
}

export interface SupplyChainEvent {
    productId: string;
    stage: string;
    timestamp: string;
    location: string;
    actor: string;
    action: string;
    temperature: string;
    humidity: string;
    notes: string;
}

export interface BlockchainBlock {
    blockIndex: number;
    timestamp: string;
    data: any;
    parentIndex: string;
}

export default AgriTraceAPI;
