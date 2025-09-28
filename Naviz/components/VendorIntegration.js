import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
const VendorIntegration = ({ materialType, quantity = 1, budget, preferredLocation, onSupplierSelect }) => {
    const [suppliers, setSuppliers] = useState([]);
    const [products, setProducts] = useState([]);
    const [selectedSupplier, setSelectedSupplier] = useState('');
    const [loading, setLoading] = useState(false);
    const [searchFilters, setSearchFilters] = useState({
        ecoOnly: false,
        localOnly: false,
        inStockOnly: true,
        maxDeliveryDays: 14
    });
    // Mock supplier database - in real implementation, this would come from APIs
    const mockSuppliers = [
        {
            id: 'home_depot',
            name: 'Home Depot',
            logo: '🏠',
            website: 'https://homedepot.com',
            rating: 4.2,
            deliveryTime: '1-3 days',
            priceRange: '$$',
            specialties: ['paint', 'wood', 'tile', 'hardware'],
            ecoCertified: false,
            location: 'Multiple Locations'
        },
        {
            id: 'lowes',
            name: 'Lowe\'s',
            logo: '🔨',
            website: 'https://lowes.com',
            rating: 4.1,
            deliveryTime: '2-5 days',
            priceRange: '$$',
            specialties: ['lumber', 'paint', 'plumbing', 'electrical'],
            ecoCertified: false,
            location: 'Multiple Locations'
        },
        {
            id: 'sherwin_williams',
            name: 'Sherwin Williams',
            logo: '🎨',
            website: 'https://sherwin-williams.com',
            rating: 4.5,
            deliveryTime: '3-7 days',
            priceRange: '$$$',
            specialties: ['paint', 'coatings', 'stains'],
            ecoCertified: true,
            location: 'Showrooms Nationwide'
        },
        {
            id: 'benjamin_moore',
            name: 'Benjamin Moore',
            logo: '🖌️',
            website: 'https://benjaminmoore.com',
            rating: 4.4,
            deliveryTime: '2-5 days',
            priceRange: '$$$',
            specialties: ['paint', 'primers', 'specialty coatings'],
            ecoCertified: true,
            location: 'Authorized Dealers'
        },
        {
            id: 'lumber_liquidators',
            name: 'Lumber Liquidators',
            logo: '🌲',
            website: 'https://lumberliquidators.com',
            rating: 4.0,
            deliveryTime: '5-10 days',
            priceRange: '$$',
            specialties: ['hardwood', 'laminate', 'tile', 'bamboo'],
            ecoCertified: true,
            location: 'Multiple Locations'
        },
        {
            id: 'flooring_direct',
            name: 'Flooring Direct',
            logo: '⬜',
            website: 'https://flooringdirect.com',
            rating: 4.3,
            deliveryTime: '7-14 days',
            priceRange: '$$',
            specialties: ['tile', 'hardwood', 'carpet', 'vinyl'],
            ecoCertified: false,
            location: 'Regional Distribution'
        }
    ];
    const mockProducts = [
        {
            id: 'paint_eco_white',
            name: 'Eco-Friendly Interior Paint - White',
            supplierId: 'benjamin_moore',
            price: 45.99,
            unit: 'gallon',
            availability: 'in-stock',
            description: 'Low-VOC, eco-friendly interior paint with excellent coverage',
            specifications: { coverage: '350 sq ft', voc: '< 50 g/L', sheen: 'eggshell' },
            ecoRating: 5,
            certifications: ['GREENGUARD', 'LEED']
        },
        {
            id: 'wood_oak_natural',
            name: 'Red Oak Hardwood Flooring',
            supplierId: 'lumber_liquidators',
            price: 4.99,
            unit: 'sq ft',
            availability: 'in-stock',
            description: 'Premium red oak hardwood with natural finish',
            specifications: { thickness: '3/4"', width: '3.25"', grade: 'Select' },
            ecoRating: 3,
            certifications: ['FSC Certified']
        },
        {
            id: 'tile_porcelain_white',
            name: 'Porcelain Subway Tile - White',
            supplierId: 'flooring_direct',
            price: 1.25,
            unit: 'sq ft',
            availability: 'limited',
            description: 'Durable porcelain subway tile, perfect for bathrooms and kitchens',
            specifications: { size: '3x6"', finish: 'glossy', water_absorption: '< 0.5%' },
            ecoRating: 4,
            certifications: ['ANSI Certified']
        }
    ];
    useEffect(() => {
        loadSuppliersAndProducts();
    }, [materialType, searchFilters]);
    const loadSuppliersAndProducts = async () => {
        setLoading(true);
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        // Filter suppliers based on material type and preferences
        let filteredSuppliers = mockSuppliers.filter(supplier => supplier.specialties.includes(materialType.toLowerCase()));
        if (searchFilters.ecoOnly) {
            filteredSuppliers = filteredSuppliers.filter(s => s.ecoCertified);
        }
        if (searchFilters.localOnly && preferredLocation) {
            // In real implementation, filter by distance from preferredLocation
            filteredSuppliers = filteredSuppliers.filter(s => s.location !== 'Multiple Locations' || s.location.includes('Nationwide'));
        }
        // Filter products
        let filteredProducts = mockProducts.filter(product => {
            const supplier = mockSuppliers.find(s => s.id === product.supplierId);
            return supplier && filteredSuppliers.includes(supplier);
        });
        if (searchFilters.inStockOnly) {
            filteredProducts = filteredProducts.filter(p => p.availability === 'in-stock');
        }
        if (budget) {
            filteredProducts = filteredProducts.filter(p => p.price <= budget);
        }
        setSuppliers(filteredSuppliers);
        setProducts(filteredProducts);
        setLoading(false);
    };
    const handleSupplierSelect = (supplierId) => {
        setSelectedSupplier(supplierId);
    };
    const handleProductSelect = (product) => {
        const supplier = suppliers.find(s => s.id === product.supplierId);
        if (supplier && onSupplierSelect) {
            onSupplierSelect(supplier, product);
        }
    };
    const getAvailabilityColor = (availability) => {
        switch (availability) {
            case 'in-stock': return '#4CAF50';
            case 'limited': return '#FF9800';
            case 'out-of-stock': return '#F44336';
            default: return '#9E9E9E';
        }
    };
    const getEcoRatingColor = (rating) => {
        if (rating >= 4)
            return '#4CAF50';
        if (rating >= 3)
            return '#FF9800';
        return '#F44336';
    };
    return (_jsxs("div", { className: "vendor-integration-container", children: [_jsx("h3", { className: "vendor-integration-title", children: "\uD83C\uDFEA Vendor Integration" }), _jsxs("div", { className: "search-filters-section", children: [_jsx("h4", { className: "section-title", children: "Filters" }), _jsxs("div", { className: "filters-list", children: [_jsxs("label", { className: "filter-option", children: [_jsx("input", { type: "checkbox", checked: searchFilters.ecoOnly, onChange: (e) => setSearchFilters(prev => ({ ...prev, ecoOnly: e.target.checked })) }), "\uD83C\uDF31 Eco-certified only"] }), _jsxs("label", { className: "filter-option", children: [_jsx("input", { type: "checkbox", checked: searchFilters.localOnly, onChange: (e) => setSearchFilters(prev => ({ ...prev, localOnly: e.target.checked })) }), "\uD83D\uDCCD Local suppliers only"] }), _jsxs("label", { className: "filter-option", children: [_jsx("input", { type: "checkbox", checked: searchFilters.inStockOnly, onChange: (e) => setSearchFilters(prev => ({ ...prev, inStockOnly: e.target.checked })) }), "\uD83D\uDCE6 In-stock only"] })] })] }), _jsxs("div", { className: "suppliers-section", children: [_jsx("h4", { className: "section-title", children: "Available Suppliers" }), loading ? (_jsx("div", { className: "loading-message", children: "\uD83D\uDD04 Loading suppliers..." })) : (_jsx("div", { className: "suppliers-list", children: suppliers.map(supplier => (_jsx("div", { onClick: () => handleSupplierSelect(supplier.id), className: `supplier-card ${selectedSupplier === supplier.id ? 'selected' : ''}`, children: _jsxs("div", { className: "supplier-content", children: [_jsx("span", { className: "supplier-logo", children: supplier.logo }), _jsxs("div", { className: "supplier-info", children: [_jsx("div", { className: "supplier-name", children: supplier.name }), _jsxs("div", { className: "supplier-details", children: ["\u2B50 ", supplier.rating, " \u2022 ", supplier.deliveryTime, " \u2022 ", supplier.priceRange] }), _jsx("div", { className: `supplier-certification ${supplier.ecoCertified ? 'eco-certified' : 'standard'}`, children: supplier.ecoCertified ? '🌱 Eco-Certified' : 'Standard Supplier' })] }), _jsx("a", { href: supplier.website, target: "_blank", rel: "noopener noreferrer", onClick: (e) => e.stopPropagation(), className: "supplier-link", children: "Visit \u2192" })] }) }, supplier.id))) }))] }), selectedSupplier && (_jsxs("div", { className: "products-section", children: [_jsx("h4", { className: "section-title", children: "Available Products" }), _jsx("div", { className: "products-list", children: products
                            .filter(product => product.supplierId === selectedSupplier)
                            .map(product => (_jsxs("div", { onClick: () => handleProductSelect(product), className: "product-card", children: [_jsx("div", { className: "product-name", children: product.name }), _jsx("div", { className: "product-description", children: product.description }), _jsxs("div", { className: "product-details", children: [_jsxs("div", { className: "product-price-info", children: [_jsxs("div", { className: "product-price", children: ["$", product.price, "/", product.unit] }), _jsx("div", { className: `product-availability ${product.availability}`, children: product.availability.replace('-', ' ').toUpperCase() })] }), _jsxs("div", { className: "product-rating", children: [_jsxs("div", { className: `product-eco-rating eco-rating-${product.ecoRating >= 4 ? 'high' : product.ecoRating >= 3 ? 'medium' : 'low'}`, children: ["\uD83C\uDF31 Eco: ", product.ecoRating, "/5"] }), product.certifications.length > 0 && (_jsx("div", { className: "product-certifications", children: product.certifications.join(', ') }))] })] })] }, product.id))) })] })), suppliers.length === 0 && !loading && (_jsxs("div", { className: "no-suppliers-message", children: ["No suppliers found for ", materialType, ". Try adjusting your filters."] }))] }));
};
export default VendorIntegration;
