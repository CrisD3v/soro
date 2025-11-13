# Campos Personalizados (Custom Fields)

## 🎨 Configuración Dinámica sin Código

El sistema permite agregar campos personalizados a cualquier entidad sin modificar el schema de la base de datos.

## 📊 Modelo de Datos

```prisma
model CustomField {
  id          String  @id @default(uuid())
  companyId   String  // Multi-tenant
  entity      String  // "users", "projects", "contacts", etc.
  fieldName   String  // "industry", "budget", "priority_level"
  fieldType   String  // "text", "number", "date", "select", "boolean"
  fieldConfig Json    // Configuración específica del tipo
  isRequired  Boolean @default(false)
  isActive    Boolean @default(true)

  @@unique([companyId, entity, fieldName])
  @@index([companyId])
  @@index([entity])
}
```

## 🔧 Tipos de Campos Soportados

### Text
```json
{
  "type": "text",
  "maxLength": 255,
  "minLength": 0,
  "pattern": "^[A-Za-z]+$"
}
```

### Number
```json
{
  "type": "number",
  "min": 0,
  "max": 1000000,
  "decimals": 2
}
```

### Date
```json
{
  "type": "date",
  "minDate": "2024-01-01",
  "maxDate": "2025-12-31"
}
```

### Select (Dropdown)
```json
{
  "type": "select",
  "options": [
    { "value": "option1", "label": "Opción 1" },
    { "value": "option2", "label": "Opción 2" }
  ],
  "multiple": false
}
```

### Boolean (Checkbox)
```json
{
  "type": "boolean",
  "defaultValue": false
}
```

## 💾 Almacenamiento de Valores

Los valores se guardan en un campo JSON en cada entidad:

```prisma
model Contact {
  id         String @id
  name       String
  email      String
  customData Json   @default("{}") // ✅ Valores de custom fields
}
```

Ejemplo de `customData`:
```json
{
  "industry": "Technology",
  "budget": 50000,
  "priority_level": "high",
  "is_vip": true,
  "contract_date": "2024-12-01"
}
```

## 🎯 Uso en la API

### Crear Custom Field

```typescript
POST /custom-fields

{
  "entity": "contacts",
  "fieldName": "industry",
  "fieldType": "select",
  "fieldConfig": {
    "options": [
      { "value": "tech", "label": "Technology" },
      { "value": "finance", "label": "Finance" },
      { "value": "health", "label": "Healthcare" }
    ]
  },
  "isRequired": false
}
```

### Crear Entidad con Custom Fields

```typescript
POST /contacts

{
  "name": "ACME Corp",
  "email": "contact@acme.com",
  "customData": {
    "industry": "tech",
    "budget": 100000,
    "is_vip": true
  }
}
```

### Validación Automática

```typescript
@Injectable()
export class CustomFieldValidator {
  async validate(
    companyId: string,
    entity: string,
    customData: Record<string, any>,
  ): Promise<void> {
    const fields = await this.getCustomFields(companyId, entity);

    for (const field of fields) {
      const value = customData[field.fieldName];

      // Validar campos requeridos
      if (field.isRequired && !value) {
        throw new BadRequestException(
          `Field ${field.fieldName} is required`
        );
      }

      // Validar según tipo
      await this.validateFieldType(field, value);
    }
  }

  private async validateFieldType(field: CustomField, value: any): Promise<void> {
    const config = field.fieldConfig as any;

    switch (field.fieldType) {
      case 'text':
        if (typeof value !== 'string') {
          throw new BadRequestException(`${field.fieldName} must be a string`);
        }
        if (config.maxLength && value.length > config.maxLength) {
          throw new BadRequestException(
            `${field.fieldName} exceeds max length`
          );
        }
        break;

      case 'number':
        if (typeof value !== 'number') {
          throw new BadRequestException(`${field.fieldName} must be a number`);
        }
        if (config.min !== undefined && value < config.min) {
          throw new BadRequestException(
            `${field.fieldName} must be >= ${config.min}`
          );
        }
        break;

      case 'select':
        const validOptions = config.options.map(o => o.value);
        if (!validOptions.includes(value)) {
          throw new BadRequestException(
            `${field.fieldName} must be one of: ${validOptions.join(', ')}`
          );
        }
        break;

      // ... otros tipos
    }
  }
}
```

## 🔍 Búsqueda por Custom Fields

```typescript
// Buscar contactos por custom field
GET /contacts?customData.industry=tech&customData.budget[gte]=50000

// Implementación
async search(filters: ContactFilters) {
  const where: any = {
    companyId: this.tenantId,
  };

  // Filtros por custom fields usando JSON operators
  if (filters.customData) {
    Object.entries(filters.customData).forEach(([key, value]) => {
      where.customData = {
        ...where.customData,
        path: [key],
        equals: value,
      };
    });
  }

  return await this.prisma.contact.findMany({ where });
}
```

## 📋 Listar Custom Fields de una Entidad

```typescript
GET /custom-fields?entity=contacts

Response:
[
  {
    "id": "uuid",
    "entity": "contacts",
    "fieldName": "industry",
    "fieldType": "select",
    "fieldConfig": {
      "options": [...]
    },
    "isRequired": false,
    "isActive": true
  }
]
```

## 🔗 Referencias

- [JSON Fields in Prisma](https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields)
- [Dynamic Forms](https://angular.io/guide/dynamic-form)
