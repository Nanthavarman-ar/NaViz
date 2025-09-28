import { Mesh, Vector3, Color3, StandardMaterial, TransformNode, DynamicTexture } from '@babylonjs/core';
export class MarketManager {
    constructor(engine, scene, featureManager) {
        Object.defineProperty(this, "engine", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "scene", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "featureManager", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "leads", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "bids", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "products", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "shoppingCarts", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        Object.defineProperty(this, "virtualShowrooms", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "biddingMode", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "timeLimit", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 300000
        }); // 5 minutes in milliseconds
        Object.defineProperty(this, "config", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "showroomGroup", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "productModels", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        this.engine = engine;
        this.scene = scene;
        this.featureManager = featureManager;
        this.config = {
            enableVirtualTryOn: false,
            enableARPlacement: false,
            enableSocialShopping: false,
            enableRecommendations: true,
            currency: 'USD',
            taxRate: 0.08,
            shippingEnabled: true
        };
        this.initializeShowroom();
        this.initializeDefaultProducts();
    }
    initializeShowroom() {
        this.showroomGroup = new TransformNode('virtual_showroom', this.scene);
        this.showroomGroup.setEnabled(false); // Hidden by default
    }
    initializeDefaultProducts() {
        // Initialize with sample furniture products
        this.products = [
            {
                id: 'sofa_modern_001',
                name: 'Modern Leather Sofa',
                description: 'Contemporary 3-seater leather sofa with clean lines and comfortable seating',
                category: 'furniture',
                price: 2499.99,
                currency: 'USD',
                dimensions: { width: 2.4, height: 0.8, depth: 0.9 },
                materials: ['leather', 'wood', 'metal'],
                tags: ['modern', 'leather', 'comfortable', 'living room'],
                inStock: true,
                rating: 4.5,
                reviews: 128,
                modelUrl: '/models/sofa_modern_001.glb'
            },
            {
                id: 'dining_table_wood_001',
                name: 'Rustic Dining Table',
                description: 'Solid wood dining table that seats 6-8 people',
                category: 'furniture',
                price: 1299.99,
                currency: 'USD',
                dimensions: { width: 2.0, height: 0.75, depth: 1.0 },
                materials: ['oak wood', 'varnish'],
                tags: ['dining', 'wood', 'rustic', 'family'],
                inStock: true,
                rating: 4.2,
                reviews: 89,
                modelUrl: '/models/dining_table_wood_001.glb'
            },
            {
                id: 'bedroom_set_001',
                name: 'Complete Bedroom Set',
                description: 'King size bed, nightstands, dresser, and mirror',
                category: 'bedroom',
                price: 3499.99,
                currency: 'USD',
                dimensions: { width: 2.0, height: 1.0, depth: 2.0 },
                materials: ['wood', 'fabric', 'metal'],
                tags: ['bedroom', 'complete set', 'king size'],
                inStock: true,
                rating: 4.7,
                reviews: 203,
                modelUrl: '/models/bedroom_set_001.glb'
            },
            {
                id: 'office_chair_ergonomic_001',
                name: 'Ergonomic Office Chair',
                description: 'Adjustable ergonomic chair with lumbar support',
                category: 'office',
                price: 499.99,
                currency: 'USD',
                dimensions: { width: 0.6, height: 1.2, depth: 0.6 },
                materials: ['mesh', 'metal', 'plastic'],
                tags: ['office', 'ergonomic', 'adjustable'],
                inStock: true,
                rating: 4.3,
                reviews: 156,
                modelUrl: '/models/office_chair_ergonomic_001.glb'
            },
            {
                id: 'kitchen_island_001',
                name: 'Modern Kitchen Island',
                description: 'Granite countertop kitchen island with storage',
                category: 'kitchen',
                price: 1899.99,
                currency: 'USD',
                dimensions: { width: 1.8, height: 0.9, depth: 0.8 },
                materials: ['granite', 'wood', 'metal'],
                tags: ['kitchen', 'island', 'storage', 'granite'],
                inStock: true,
                rating: 4.4,
                reviews: 67,
                modelUrl: '/models/kitchen_island_001.glb'
            }
        ];
    }
    // Enhanced lead capture
    captureLead(leadData) {
        const lead = {
            ...leadData,
            id: `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            timestamp: Date.now(),
        };
        this.leads.push(lead);
        console.log('Lead captured:', lead);
        return lead.id;
    }
    // Enhanced bidding system
    placeBid(itemId, userId, bidAmount) {
        if (!this.biddingMode) {
            console.warn('Bidding is not currently active');
            return false;
        }
        // Validate bid amount
        const product = this.products.find(p => p.id === itemId);
        if (!product) {
            console.error('Product not found for bidding');
            return false;
        }
        const currentHighest = this.getHighestBid(itemId);
        if (currentHighest && bidAmount <= currentHighest.bidAmount) {
            console.warn('Bid amount must be higher than current highest bid');
            return false;
        }
        const bid = {
            itemId,
            userId,
            bidAmount,
            timestamp: Date.now(),
        };
        this.bids.push(bid);
        console.log('Bid placed:', bid);
        return true;
    }
    // Shopping cart management
    addToCart(userId, productId, quantity = 1, options = {}) {
        const product = this.products.find(p => p.id === productId);
        if (!product || !product.inStock) {
            console.error('Product not available');
            return false;
        }
        let cart = this.shoppingCarts.get(userId);
        if (!cart) {
            cart = {
                userId,
                items: [],
                total: 0,
                currency: this.config.currency,
                createdAt: Date.now(),
                updatedAt: Date.now()
            };
            this.shoppingCarts.set(userId, cart);
        }
        // Check if item already in cart
        const existingItem = cart.items.find(item => item.productId === productId);
        if (existingItem) {
            existingItem.quantity += quantity;
            existingItem.selectedOptions = { ...existingItem.selectedOptions, ...options };
        }
        else {
            cart.items.push({
                productId,
                quantity,
                selectedOptions: options,
                addedAt: Date.now()
            });
        }
        this.updateCartTotal(cart);
        console.log('Item added to cart:', { userId, productId, quantity });
        return true;
    }
    removeFromCart(userId, productId) {
        const cart = this.shoppingCarts.get(userId);
        if (!cart)
            return false;
        cart.items = cart.items.filter(item => item.productId !== productId);
        this.updateCartTotal(cart);
        if (cart.items.length === 0) {
            this.shoppingCarts.delete(userId);
        }
        console.log('Item removed from cart:', { userId, productId });
        return true;
    }
    getCart(userId) {
        return this.shoppingCarts.get(userId) || null;
    }
    checkoutCart(userId, paymentMethod) {
        const cart = this.shoppingCarts.get(userId);
        if (!cart || cart.items.length === 0) {
            return { success: false, message: 'Cart is empty' };
        }
        // Calculate final total with tax and shipping
        const subtotal = cart.total;
        const tax = subtotal * this.config.taxRate;
        const shipping = this.config.shippingEnabled ? this.calculateShipping(cart) : 0;
        const finalTotal = subtotal + tax + shipping;
        const order = {
            orderId: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            userId,
            items: cart.items,
            subtotal,
            tax,
            shipping,
            total: finalTotal,
            currency: cart.currency,
            paymentMethod,
            status: 'confirmed',
            timestamp: Date.now()
        };
        // Clear cart after successful checkout
        this.shoppingCarts.delete(userId);
        console.log('Order placed:', order);
        return { success: true, order };
    }
    updateCartTotal(cart) {
        let total = 0;
        cart.items.forEach(item => {
            const product = this.products.find(p => p.id === item.productId);
            if (product) {
                total += product.price * item.quantity;
            }
        });
        cart.total = total;
        cart.updatedAt = Date.now();
    }
    calculateShipping(cart) {
        // Simple shipping calculation based on item count and weight
        const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
        return Math.max(9.99, itemCount * 2.99); // Minimum $9.99 shipping
    }
    // Virtual showroom management
    createShowroom(name, theme, products, layout = 'grid') {
        const showroom = {
            id: `showroom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            name,
            theme,
            products,
            layout,
            lighting: 'natural',
            isActive: false
        };
        this.virtualShowrooms.push(showroom);
        console.log('Virtual showroom created:', showroom);
        return showroom.id;
    }
    activateShowroom(showroomId) {
        const showroom = this.virtualShowrooms.find(s => s.id === showroomId);
        if (!showroom)
            return false;
        // Deactivate all other showrooms
        this.virtualShowrooms.forEach(s => s.isActive = false);
        showroom.isActive = true;
        this.renderShowroom(showroom);
        console.log('Showroom activated:', showroomId);
        return true;
    }
    renderShowroom(showroom) {
        if (!this.showroomGroup)
            return;
        // Clear existing showroom
        this.showroomGroup.getChildren().forEach(child => child.dispose());
        // Render products based on layout
        showroom.products.forEach((productId, index) => {
            const product = this.products.find(p => p.id === productId);
            if (!product)
                return;
            this.renderProductInShowroom(product, index, showroom.layout);
        });
        this.showroomGroup.setEnabled(true);
    }
    renderProductInShowroom(product, index, layout) {
        if (!this.showroomGroup)
            return;
        let position;
        switch (layout) {
            case 'grid':
                const gridSize = Math.ceil(Math.sqrt(this.virtualShowrooms[0]?.products.length || 1));
                const row = Math.floor(index / gridSize);
                const col = index % gridSize;
                position = new Vector3(col * 3 - (gridSize * 1.5), 0, row * 3 - (gridSize * 1.5));
                break;
            case 'circular':
                const angle = (index / (this.virtualShowrooms[0]?.products.length || 1)) * Math.PI * 2;
                const radius = 5;
                position = new Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
                break;
            default:
                position = new Vector3((Math.random() - 0.5) * 10, 0, (Math.random() - 0.5) * 10);
        }
        // Create product mesh
        const mesh = Mesh.CreateBox(`${product.id}_showroom`, 1, this.scene);
        mesh.position = position;
        mesh.scaling = new Vector3(product.dimensions.width, product.dimensions.height, product.dimensions.depth);
        // Create material
        const material = new StandardMaterial(`${product.id}_material`, this.scene);
        material.diffuseColor = this.getProductColor(product.category);
        mesh.material = material;
        // Add price label
        this.addPriceLabel(mesh, product);
        mesh.parent = this.showroomGroup;
        this.productModels.set(product.id, mesh);
    }
    getProductColor(category) {
        const colorMap = {
            furniture: new Color3(0.6, 0.4, 0.2),
            bedroom: new Color3(0.8, 0.6, 0.8),
            office: new Color3(0.4, 0.4, 0.6),
            kitchen: new Color3(0.7, 0.7, 0.9)
        };
        return colorMap[category] || new Color3(0.5, 0.5, 0.5);
    }
    addPriceLabel(mesh, product) {
        const texture = new DynamicTexture(`${product.id}_label`, { width: 512, height: 128 }, this.scene, false);
        const context = texture.getContext();
        context.font = 'bold 48px Arial';
        context.fillStyle = 'white';
        context.fillText(`$${product.price}`, 10, 80);
        texture.update();
        const labelMaterial = new StandardMaterial(`${product.id}_label_material`, this.scene);
        labelMaterial.diffuseTexture = texture;
        labelMaterial.disableLighting = true;
        const labelMesh = Mesh.CreatePlane(`${product.id}_label_mesh`, 1, this.scene);
        labelMesh.position = mesh.position.add(new Vector3(0, mesh.scaling.y + 0.5, 0));
        labelMesh.material = labelMaterial;
        labelMesh.parent = mesh;
    }
    // Product recommendations
    getRecommendations(userId, currentProductId) {
        if (!this.config.enableRecommendations)
            return [];
        const cart = this.shoppingCarts.get(userId);
        const userPreferences = this.analyzeUserPreferences(userId);
        let recommendations = [];
        if (currentProductId) {
            // Similar products
            const currentProduct = this.products.find(p => p.id === currentProductId);
            if (currentProduct) {
                recommendations = this.products.filter(p => p.id !== currentProductId &&
                    (p.category === currentProduct.category ||
                        p.tags.some(tag => currentProduct.tags.includes(tag))));
            }
        }
        else if (cart) {
            // Based on cart contents
            const cartCategories = new Set(cart.items.map(item => {
                const product = this.products.find(p => p.id === item.productId);
                return product?.category;
            }).filter(Boolean));
            recommendations = this.products.filter(p => !cart.items.some(item => item.productId === p.id) &&
                cartCategories.has(p.category));
        }
        // Apply user preferences
        if (userPreferences.length > 0) {
            recommendations = recommendations.filter(p => p.tags.some(tag => userPreferences.includes(tag)));
        }
        return recommendations.slice(0, 5); // Return top 5
    }
    analyzeUserPreferences(userId) {
        const cart = this.shoppingCarts.get(userId);
        if (!cart)
            return [];
        const preferences = {};
        cart.items.forEach(item => {
            const product = this.products.find(p => p.id === item.productId);
            if (product) {
                product.tags.forEach(tag => {
                    preferences[tag] = (preferences[tag] || 0) + 1;
                });
            }
        });
        return Object.entries(preferences)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 3)
            .map(([tag]) => tag);
    }
    // Virtual try-on functionality
    enableVirtualTryOn(productId, userPosition) {
        if (!this.config.enableVirtualTryOn)
            return false;
        const product = this.products.find(p => p.id === productId);
        if (!product)
            return false;
        // Create temporary mesh for try-on
        const tryOnMesh = Mesh.CreateBox(`${productId}_tryon`, 1, this.scene);
        tryOnMesh.position = userPosition;
        tryOnMesh.scaling = new Vector3(product.dimensions.width * 0.5, product.dimensions.height * 0.5, product.dimensions.depth * 0.5);
        const material = new StandardMaterial(`${productId}_tryon_material`, this.scene);
        material.diffuseColor = this.getProductColor(product.category);
        material.alpha = 0.7; // Semi-transparent for try-on
        tryOnMesh.material = material;
        // Auto-remove after 30 seconds
        setTimeout(() => {
            tryOnMesh.dispose();
        }, 30000);
        console.log('Virtual try-on enabled for:', productId);
        return true;
    }
    // AR placement functionality
    enableARPlacement(productId, placementPosition) {
        if (!this.config.enableARPlacement)
            return false;
        const product = this.products.find(p => p.id === productId);
        if (!product)
            return false;
        // Create AR placement mesh
        const arMesh = Mesh.CreateBox(`${productId}_ar`, 1, this.scene);
        arMesh.position = placementPosition;
        arMesh.scaling = new Vector3(product.dimensions.width, product.dimensions.height, product.dimensions.depth);
        const material = new StandardMaterial(`${productId}_ar_material`, this.scene);
        material.diffuseColor = this.getProductColor(product.category);
        material.wireframe = true; // Wireframe for AR placement
        arMesh.material = material;
        console.log('AR placement enabled for:', productId);
        return true;
    }
    // Social shopping features
    shareProduct(productId, userId, platform) {
        const product = this.products.find(p => p.id === productId);
        if (!product)
            return false;
        console.log(`Product ${productId} shared by ${userId} on ${platform}`);
        // In real implementation, this would integrate with social media APIs
        return true;
    }
    getProductReviews(productId) {
        // Mock reviews - in real implementation, this would fetch from a database
        const product = this.products.find(p => p.id === productId);
        if (!product)
            return [];
        const mockReviews = [
            { user: 'John D.', rating: 5, comment: 'Excellent quality and comfort!' },
            { user: 'Sarah M.', rating: 4, comment: 'Great value for money' },
            { user: 'Mike R.', rating: 5, comment: 'Perfect for our living room' }
        ];
        return mockReviews.slice(0, Math.min(product.reviews, 3));
    }
    // Bidding methods
    startBiddingSession(itemId, timeLimit = this.timeLimit) {
        this.biddingMode = true;
        this.timeLimit = timeLimit;
        console.log(`Bidding session started for item ${itemId}, time limit: ${timeLimit}ms`);
        // Auto-end bidding after time limit
        setTimeout(() => {
            this.endBiddingSession();
        }, timeLimit);
    }
    endBiddingSession() {
        this.biddingMode = false;
        console.log('Bidding session ended');
    }
    // Getters
    getLeads() {
        return this.leads;
    }
    getBids(itemId) {
        if (itemId) {
            return this.bids.filter(bid => bid.itemId === itemId);
        }
        return this.bids;
    }
    getProducts(category) {
        if (category) {
            return this.products.filter(p => p.category === category);
        }
        return this.products;
    }
    getProduct(productId) {
        return this.products.find(p => p.id === productId) || null;
    }
    getHighestBid(itemId) {
        const itemBids = this.getBids(itemId);
        if (itemBids.length === 0)
            return null;
        return itemBids.reduce((highest, current) => current.bidAmount > highest.bidAmount ? current : highest);
    }
    getVirtualShowrooms() {
        return this.virtualShowrooms;
    }
    isBiddingActive() {
        return this.biddingMode;
    }
    // Configuration
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
    }
    getConfig() {
        return this.config;
    }
    // Export methods
    exportLeads() {
        return JSON.stringify(this.leads, null, 2);
    }
    exportCommerceData() {
        return JSON.stringify({
            leads: this.leads,
            bids: this.bids,
            products: this.products,
            shoppingCarts: Array.from(this.shoppingCarts.values()),
            virtualShowrooms: this.virtualShowrooms,
            config: this.config
        }, null, 2);
    }
    // Showroom controls
    toggleShowroom() {
        if (this.showroomGroup) {
            const isVisible = this.showroomGroup.isEnabled();
            this.showroomGroup.setEnabled(!isVisible);
            console.log(`Virtual showroom ${!isVisible ? 'enabled' : 'disabled'}`);
        }
    }
    clearData() {
        this.leads = [];
        this.bids = [];
        this.shoppingCarts.clear();
        this.productModels.clear();
    }
    dispose() {
        this.clearData();
        if (this.showroomGroup) {
            this.showroomGroup.dispose();
        }
        this.productModels.forEach(mesh => mesh.dispose());
        this.productModels.clear();
    }
}
