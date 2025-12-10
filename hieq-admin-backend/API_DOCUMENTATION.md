# Assessment API Documentation

## Base URL
```
http://localhost:4000/api/admin/assessment
```

## Authentication
All endpoints require authentication. Include the Bearer token in the Authorization header:
```
Authorization: Bearer <your_access_token>
```

## Endpoints

### 1. Get All Items by Type
**GET** `/api/admin/assessment/:type`

Get all items of a specific type (Skills, College, Jobs, Industries).

**URL Parameters:**
- `type` (required): One of `Skills`, `College`, `Jobs`, `Industries`

**Query Parameters:**
- `search` (optional): Search by name (case-insensitive)
- `status` (optional): Filter by status (`true` for active, `false` for inactive)

**Example Request:**
```bash
GET http://localhost:4000/api/admin/assessment/Skills?search=javascript&status=true
Authorization: Bearer <your_token>
```

**Example Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "JavaScript",
    "status": true,
    "type": "Skills",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

---

### 2. Get Single Item by ID
**GET** `/api/admin/assessment/:type/:id`

Get a single item by its ID.

**URL Parameters:**
- `type` (required): One of `Skills`, `College`, `Jobs`, `Industries`
- `id` (required): MongoDB ObjectId

**Example Request:**
```bash
GET http://localhost:4000/api/admin/assessment/Skills/507f1f77bcf86cd799439011
Authorization: Bearer <your_token>
```

**Example Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "JavaScript",
  "status": true,
  "type": "Skills",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

---

### 3. Create New Item
**POST** `/api/admin/assessment/:type`

Create a new item.

**URL Parameters:**
- `type` (required): One of `Skills`, `College`, `Jobs`, `Industries`

**Request Body:**
```json
{
  "name": "React",
  "status": true
}
```

**Example Request (cURL):**
```bash
curl -X POST http://localhost:4000/api/admin/assessment/Skills \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_token>" \
  -d '{
    "name": "React",
    "status": true
  }'
```

**Example Request (Postman/Thunder Client):**
- Method: POST
- URL: `http://localhost:4000/api/admin/assessment/Skills`
- Headers:
  - `Content-Type: application/json`
  - `Authorization: Bearer <your_token>`
- Body (raw JSON):
```json
{
  "name": "React",
  "status": true
}
```

**Example Response:**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "name": "React",
  "status": true,
  "type": "Skills",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Error Responses:**
- `400`: Name is required / Item with this name already exists
- `401`: Missing or invalid token
- `403`: Forbidden - insufficient role

---

### 4. Update Item
**PATCH** `/api/admin/assessment/:type/:id`

Update an existing item.

**URL Parameters:**
- `type` (required): One of `Skills`, `College`, `Jobs`, `Industries`
- `id` (required): MongoDB ObjectId

**Request Body (all fields optional):**
```json
{
  "name": "React.js",
  "status": false
}
```

**Example Request (cURL):**
```bash
curl -X PATCH http://localhost:4000/api/admin/assessment/Skills/507f1f77bcf86cd799439012 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_token>" \
  -d '{
    "name": "React.js",
    "status": false
  }'
```

**Example Response:**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "name": "React.js",
  "status": false,
  "type": "Skills",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-02T00:00:00.000Z"
}
```

---

### 5. Delete Item
**DELETE** `/api/admin/assessment/:type/:id`

Delete an item.

**URL Parameters:**
- `type` (required): One of `Skills`, `College`, `Jobs`, `Industries`
- `id` (required): MongoDB ObjectId

**Example Request (cURL):**
```bash
curl -X DELETE http://localhost:4000/api/admin/assessment/Skills/507f1f77bcf86cd799439012 \
  -H "Authorization: Bearer <your_token>"
```

**Example Response:**
```json
{
  "message": "Item deleted successfully"
}
```

---

### 6. Toggle Status
**PATCH** `/api/admin/assessment/:type/:id/status`

Toggle the status of an item (active/inactive).

**URL Parameters:**
- `type` (required): One of `Skills`, `College`, `Jobs`, `Industries`
- `id` (required): MongoDB ObjectId

**Request Body:**
```json
{
  "status": false
}
```

**Example Request (cURL):**
```bash
curl -X PATCH http://localhost:4000/api/admin/assessment/Skills/507f1f77bcf86cd799439012/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_token>" \
  -d '{
    "status": false
  }'
```

**Example Response:**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "name": "React",
  "status": false,
  "type": "Skills",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-02T00:00:00.000Z"
}
```

---

## Test Payloads

### Create Skill
```json
POST /api/admin/assessment/Skills
{
  "name": "JavaScript",
  "status": true
}
```

### Create College
```json
POST /api/admin/assessment/College
{
  "name": "MIT",
  "status": true
}
```

### Create Job
```json
POST /api/admin/assessment/Jobs
{
  "name": "Software Engineer",
  "status": true
}
```

### Create Industry
```json
POST /api/admin/assessment/Industries
{
  "name": "Technology",
  "status": true
}
```

---

## Error Codes

- `400`: Bad Request - Invalid input or duplicate name
- `401`: Unauthorized - Missing or invalid token
- `403`: Forbidden - Insufficient role permissions
- `404`: Not Found - Item not found
- `500`: Internal Server Error

---

## Notes

1. The `name` field must be unique within each type (e.g., you can have "JavaScript" in both Skills and Jobs, but not two "JavaScript" entries in Skills).

2. The `status` field defaults to `true` if not provided.

3. All timestamps are in ISO 8601 format.

4. The `type` field is automatically set based on the URL parameter and cannot be changed via update.

