# Discount Service Implementation Approach

## Overview of the Assignment

This project involves creating a discount service for an e-commerce application that will allow merchants to create and manage different types of discounts for their products. The service should be flexible, scalable, and maintainable.

## System Design

### Architecture

- **Microservice Architecture**: Implement as an independent service with its own data store
- **API-First Design**: Create RESTful endpoints for discount operations
- **Event-Driven Communication**: Use message queues for communication with other services

### Core Components

1. **Discount Service API**

   - Endpoints for CRUD operations on discounts
   - Authentication and authorization middleware
   - Input validation and error handling

2. **Discount Engine**

   - Rule evaluation system
   - Discount calculation logic
   - Eligibility checker

3. **Data Storage**

   - Discount definitions
   - Discount rules
   - Usage records and analytics

4. **Event Handlers**
   - Listen for order events
   - Process discount applications
   - Emit discount application events

## Discount Types and Models

### Discount Models

1. **Percentage Discount (CART_WISE)**

   - Apply a percentage reduction to entire cart value
   - Can have minimum order threshold requirements

2. **Product Specific Discount (PRODUCT_WISE)**

   - Apply a percentage reduction to specific product prices
   - Only affects selected products in the cart

3. **Buy X Get Y (BXGY)**

   - Buy specific products and get others for free or at a reduced price
   - Requires specific products in certain quantities

### Current Implementation Constraints

- **In-memory storage**: Currently using local memory for discount storage (will be replaced with DB)
- **Single-discount application**: Only the most beneficial discount is applied to a cart
- **Limited discount types**: Currently supporting only percentage-based discounts
- **No user-specific discounts**: Discounts apply to all users equally

### Security Considerations

- **Input validation**: All inputs are validated using Zod schema validation
- **Error handling**: Proper error boundaries to prevent exposing internal details
- **No authentication yet**: Admin API endpoints need authentication (future work)
- **Missing rate limiting**: API endpoints should have rate limiting implemented

### Data Models

```typescript
// Base discount model
interface Discount {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date | null;
  isActive: boolean;
  discountType: DiscountType;
  priority: number;
  rules: Rule[];
}

// Specific discount type implementations
interface PercentageDiscount extends Discount {
  percentage: number;
  maximumDiscountAmount?: number;
}

interface FixedAmountDiscount extends Discount {
  amount: number;
  minimumPurchaseAmount?: number;
}
```

## Implementation Strategy

### Phase 1: Core Framework (1-2 weeks)

1. Set up project structure and dependencies
2. Implement basic discount models and database schema
3. Create core discount calculation logic
4. Develop basic API endpoints for discount CRUD operations

### Phase 2: Advanced Features (1-2 weeks)

1. Implement complex discount types (bundle, tiered)
2. Add rule engine for eligibility conditions
3. Create discount combination logic
4. Implement event handling for order processing

### Phase 3: Integration and Testing (1 week)

1. Integrate with other services (product, order, customer)
2. Develop comprehensive test suite
3. Performance testing and optimization
4. Documentation and API specifications

### Phase 4: Deployment and Monitoring (1 week)

1. Set up CI/CD pipeline
2. Configure monitoring and alerting
3. Deploy to staging and production environments
4. Implement analytics for discount usage

## Technical Decisions

### Language and Framework

- **Node.js with TypeScript**: For type safety and maintainability
- **Express.js or NestJS**: For API development
- **PostgreSQL or MongoDB**: For data storage depending on query patterns

### Testing Strategy

- **Unit Tests**: For individual components using Jest
- **Integration Tests**: For API endpoints and service interactions
- **Performance Tests**: For discount calculation under load

### Deployment

- **Docker Containers**: For consistent deployment
- **Kubernetes**: For orchestration and scaling
- **CI/CD**: GitHub Actions or Jenkins

## Constraints and Considerations

### Performance Requirements

- Discount calculations must complete in under 200ms
- System should handle 1000+ concurrent discount calculations
- Cache frequently used discount rules

### Security Considerations

- All admin operations require authentication
- Validate all input data
- Implement rate limiting for API endpoints
- Log all discount applications for audit purposes

### Business Rules

- Multiple discounts may or may not be combinable
- Some discounts are time-bound or user-specific
- Maximum discount percentage/amount may be capped
- Discounts may have priority levels

## Potential Challenges and Solutions

### Challenges

1. **Performance**: Complex discount calculations could become resource-intensive
2. **Concurrency**: Multiple discounts being applied simultaneously
3. **Business Logic Complexity**: Handling many discount types and rules
4. **Integration**: Working with other services seamlessly

### Solutions

1. Use caching for frequently accessed discount rules
2. Implement optimistic locking for concurrent discount applications
3. Design a flexible rule engine that can handle complex business logic
4. Develop clear API contracts and use event-driven patterns for loose coupling

## Future Enhancements

### Near-term Improvements

- **Database storage**: Replace in-memory storage with actual database
- **Authentication**: Implement JWT-based auth for admin endpoints
- **Multiple discount application**: Support combining compatible discounts
- **Fixed amount discounts**: Support fixed monetary amount off
- **Discount codes**: Support for manual discount code entry

### Long-term Features

- **User-specific discounts**: Target discounts to specific user segments
- **Advanced promo types**: Tiered discounts, bundles, loyalty rewards
- **Analytics dashboard**: Track discount performance and usage
- **A/B testing**: Test different discount strategies
- **Dynamic pricing**: ML-based price optimization

## Setup and Running

```bash
# Install dependencies
npm install

# Run in development
npx ts-node-dev src/index.ts

# Build for production
npx tsc

# Run production build
node build/index.js
```

## API Endpoints

### Discount Management

- `GET /api/discounts` - List all discounts
- `GET /api/discounts/:id` - Get a specific discount
- `POST /api/discounts` - Create a new discount
- `PUT /api/discounts/:id` - Update an existing discount
- `DELETE /api/discounts/:id` - Remove a discount

### Cart Processing

- `POST /api/cart/apply-discounts` - Process cart and apply available discounts
