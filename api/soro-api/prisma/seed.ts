import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Limpiar datos existentes
  console.log('🧹 Cleaning existing data...');
  await prisma.userEnlacedRecords.deleteMany();
  await prisma.enlacedRecords.deleteMany();
  await prisma.signature.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.userRole.deleteMany();
  await prisma.rolePermission.deleteMany();
  await prisma.user.deleteMany();
  await prisma.permission.deleteMany();
  await prisma.role.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.plan.deleteMany();
  await prisma.tenantConfig.deleteMany();
  await prisma.company.deleteMany();
  await prisma.systemVersion.deleteMany();

  // 0. Crear System Version
  console.log('📌 Creating system version...');
  await prisma.systemVersion.create({
    data: {
      version: '2.0.0',
      description: 'Phase V2 - Multi-tenant core with advanced features',
    },
  });
  console.log('✅ System version created');

  // 1. Crear Planes
  console.log('💳 Creating plans...');
  const freePlan = await prisma.plan.create({
    data: {
      name: 'Free',
      description: 'Plan gratuito con funcionalidades básicas',
      price: 0,
      currency: 'USD',
      interval: 'monthly',
      trialDays: 14,
      features: {
        maxUsers: 5,
        maxProjects: 3,
        maxStorage: 1073741824, // 1GB
        projects: true,
        crm: false,
        invoicing: false,
        workflows: false,
        customFields: false,
        apiAccess: false,
      },
    },
  });

  const proPlan = await prisma.plan.create({
    data: {
      name: 'Professional',
      description: 'Plan profesional con todas las funcionalidades',
      price: 49.99,
      currency: 'USD',
      interval: 'monthly',
      trialDays: 14,
      features: {
        maxUsers: 50,
        maxProjects: 100,
        maxStorage: 107374182400, // 100GB
        projects: true,
        crm: true,
        invoicing: true,
        workflows: true,
        customFields: true,
        apiAccess: true,
      },
    },
  });

  const enterprisePlan = await prisma.plan.create({
    data: {
      name: 'Enterprise',
      description: 'Plan empresarial con recursos ilimitados',
      price: 199.99,
      currency: 'USD',
      interval: 'monthly',
      trialDays: 30,
      features: {
        maxUsers: -1, // Unlimited
        maxProjects: -1,
        maxStorage: -1,
        projects: true,
        crm: true,
        invoicing: true,
        workflows: true,
        customFields: true,
        apiAccess: true,
        dedicatedSupport: true,
        customIntegrations: true,
      },
    },
  });

  console.log('✅ Created 3 plans');

  // 2. Crear Permisos
  console.log('📋 Creating permissions...');
  const permissions = await Promise.all([
    // User permissions
    prisma.permission.create({
      data: {
        name: 'users.create',
        description: 'Create new users',
        resource: 'users',
        action: 'create',
        scope: 'COMPANY',
      },
    }),
    prisma.permission.create({
      data: {
        name: 'users.read',
        description: 'View users',
        resource: 'users',
        action: 'read',
        scope: 'COMPANY',
      },
    }),
    prisma.permission.create({
      data: {
        name: 'users.update',
        description: 'Update users',
        resource: 'users',
        action: 'update',
        scope: 'COMPANY',
      },
    }),
    prisma.permission.create({
      data: {
        name: 'users.delete',
        description: 'Delete users',
        resource: 'users',
        action: 'delete',
        scope: 'COMPANY',
      },
    }),
    // Company permissions
    prisma.permission.create({
      data: {
        name: 'companies.create',
        description: 'Create new companies',
        resource: 'companies',
        action: 'create',
        scope: 'GLOBAL',
      },
    }),
    prisma.permission.create({
      data: {
        name: 'companies.read',
        description: 'View companies',
        resource: 'companies',
        action: 'read',
        scope: 'COMPANY',
      },
    }),
    prisma.permission.create({
      data: {
        name: 'companies.update',
        description: 'Update companies',
        resource: 'companies',
        action: 'update',
        scope: 'COMPANY',
      },
    }),
    prisma.permission.create({
      data: {
        name: 'companies.delete',
        description: 'Delete companies',
        resource: 'companies',
        action: 'delete',
        scope: 'GLOBAL',
      },
    }),
    // Role permissions
    prisma.permission.create({
      data: {
        name: 'roles.create',
        description: 'Create new roles',
        resource: 'roles',
        action: 'create',
        scope: 'COMPANY',
      },
    }),
    prisma.permission.create({
      data: {
        name: 'roles.read',
        description: 'View roles',
        resource: 'roles',
        action: 'read',
        scope: 'COMPANY',
      },
    }),
    prisma.permission.create({
      data: {
        name: 'roles.update',
        description: 'Update roles',
        resource: 'roles',
        action: 'update',
        scope: 'COMPANY',
      },
    }),
    prisma.permission.create({
      data: {
        name: 'roles.delete',
        description: 'Delete roles',
        resource: 'roles',
        action: 'delete',
        scope: 'GLOBAL',
      },
    }),
    // Project permissions
    prisma.permission.create({
      data: {
        name: 'projects.create',
        description: 'Create projects',
        resource: 'projects',
        action: 'create',
        scope: 'COMPANY',
      },
    }),
    prisma.permission.create({
      data: {
        name: 'projects.read',
        description: 'View projects',
        resource: 'projects',
        action: 'read',
        scope: 'COMPANY',
      },
    }),
    prisma.permission.create({
      data: {
        name: 'projects.update',
        description: 'Update projects',
        resource: 'projects',
        action: 'update',
        scope: 'PROJECT',
      },
    }),
    prisma.permission.create({
      data: {
        name: 'projects.delete',
        description: 'Delete projects',
        resource: 'projects',
        action: 'delete',
        scope: 'COMPANY',
      },
    }),
  ]);

  console.log(`✅ Created ${permissions.length} permissions`);

  // 3. Crear Roles
  console.log('👥 Creating roles...');
  const superAdminRole = await prisma.role.create({
    data: {
      name: 'super_admin',
      description: 'Super administrador del sistema',
      isGlobal: true,
      level: 0,
    },
  });

  const adminRole = await prisma.role.create({
    data: {
      name: 'admin',
      description: 'Administrador de la empresa',
      isGlobal: false,
      level: 1,
      parentId: superAdminRole.id,
    },
  });

  const managerRole = await prisma.role.create({
    data: {
      name: 'manager',
      description: 'Manager de proyectos',
      isGlobal: false,
      level: 2,
      parentId: adminRole.id,
    },
  });

  const employeeRole = await prisma.role.create({
    data: {
      name: 'employee',
      description: 'Empleado',
      isGlobal: false,
      level: 3,
      parentId: managerRole.id,
    },
  });

  const viewerRole = await prisma.role.create({
    data: {
      name: 'viewer',
      description: 'Solo lectura',
      isGlobal: false,
      level: 4,
      parentId: employeeRole.id,
    },
  });

  console.log('✅ Created 5 roles with hierarchy');

  // 4. Asignar permisos a roles
  console.log('🔗 Assigning permissions to roles...');

  // Admin: todos los permisos
  await Promise.all(
    permissions.map((permission) =>
      prisma.rolePermission.create({
        data: {
          roleId: adminRole.id,
          permissionId: permission.id,
        },
      }),
    ),
  );

  // Manager: todos excepto delete de roles y companies
  const managerPermissions = permissions.filter(
    (p) => !['roles.delete', 'companies.delete'].includes(p.name),
  );
  await Promise.all(
    managerPermissions.map((permission) =>
      prisma.rolePermission.create({
        data: {
          roleId: managerRole.id,
          permissionId: permission.id,
        },
      }),
    ),
  );

  // Employee: solo read y create de records, read de users
  const employeePermissions = permissions.filter((p) =>
    ['records.read', 'records.create', 'users.read'].includes(p.name),
  );
  await Promise.all(
    employeePermissions.map((permission) =>
      prisma.rolePermission.create({
        data: {
          roleId: employeeRole.id,
          permissionId: permission.id,
        },
      }),
    ),
  );

  // Viewer: solo read
  const viewerPermissions = permissions.filter((p) => p.name.endsWith('.read'));
  await Promise.all(
    viewerPermissions.map((permission) =>
      prisma.rolePermission.create({
        data: {
          roleId: viewerRole.id,
          permissionId: permission.id,
        },
      }),
    ),
  );

  console.log('✅ Assigned permissions to roles');

  // 5. Crear Empresas
  console.log('🏢 Creating companies...');

  // Empresa matriz
  const acmeCorp = await prisma.company.create({
    data: {
      name: 'ACME Corporation',
      nit: '900123456-7',
      sector: 'Technology',
      address: 'Calle 100 #15-20, Bogotá',
      phone: '+573001234567',
      email: 'contact@acme.com',
      isActive: true,
    },
  });

  // Crear TenantConfig para ACME
  await prisma.tenantConfig.create({
    data: {
      companyId: acmeCorp.id,
      maxUsers: 50,
      maxProjects: 100,
      maxStorage: 107374182400, // 100GB
      features: {
        projects: true,
        crm: true,
        invoicing: true,
        workflows: false,
        customFields: true,
        apiAccess: true,
      },
      timezone: 'America/Bogota',
      locale: 'es',
    },
  });

  // Subsidiarias de ACME
  const acmeTech = await prisma.company.create({
    data: {
      name: 'ACME Tech Solutions',
      nit: '900234567-8',
      sector: 'Software Development',
      address: 'Carrera 7 #71-21, Bogotá',
      phone: '+573002345678',
      email: 'tech@acme.com',
      parentId: acmeCorp.id,
      isActive: true,
    },
  });

  await prisma.tenantConfig.create({
    data: {
      companyId: acmeTech.id,
      maxUsers: 20,
      maxProjects: 50,
      maxStorage: 53687091200, // 50GB
      features: {
        projects: true,
        crm: false,
        invoicing: false,
        workflows: false,
        customFields: false,
        apiAccess: false,
      },
      timezone: 'America/Bogota',
      locale: 'es',
    },
  });

  const acmeLogistics = await prisma.company.create({
    data: {
      name: 'ACME Logistics',
      nit: '900345678-9',
      sector: 'Logistics',
      address: 'Avenida 68 #25-47, Bogotá',
      phone: '+573003456789',
      email: 'logistics@acme.com',
      parentId: acmeCorp.id,
      isActive: true,
    },
  });

  await prisma.tenantConfig.create({
    data: {
      companyId: acmeLogistics.id,
      maxUsers: 15,
      maxProjects: 30,
      maxStorage: 21474836480, // 20GB
      features: {
        projects: true,
        crm: false,
        invoicing: false,
        workflows: false,
        customFields: false,
        apiAccess: false,
      },
      timezone: 'America/Bogota',
      locale: 'es',
    },
  });

  // Otra empresa independiente
  const globalInc = await prisma.company.create({
    data: {
      name: 'Global Industries Inc',
      nit: '900456789-0',
      sector: 'Manufacturing',
      address: 'Calle 26 #92-32, Bogotá',
      phone: '+573004567890',
      email: 'contact@global.com',
      isActive: true,
    },
  });

  await prisma.tenantConfig.create({
    data: {
      companyId: globalInc.id,
      maxUsers: 100,
      maxProjects: 200,
      maxStorage: 214748364800, // 200GB
      features: {
        projects: true,
        crm: true,
        invoicing: true,
        workflows: true,
        customFields: true,
        apiAccess: true,
      },
      timezone: 'America/Bogota',
      locale: 'es',
    },
  });

  // Subsidiaria de Global
  const globalServices = await prisma.company.create({
    data: {
      name: 'Global Services',
      nit: '900567890-1',
      sector: 'Services',
      address: 'Carrera 15 #93-40, Bogotá',
      phone: '+573005678901',
      email: 'services@global.com',
      parentId: globalInc.id,
      isActive: true,
    },
  });

  await prisma.tenantConfig.create({
    data: {
      companyId: globalServices.id,
      maxUsers: 30,
      maxProjects: 60,
      maxStorage: 53687091200, // 50GB
      features: {
        projects: true,
        crm: true,
        invoicing: false,
        workflows: false,
        customFields: false,
        apiAccess: false,
      },
      timezone: 'America/Bogota',
      locale: 'es',
    },
  });

  console.log('✅ Created 5 companies with tenant configs');

  // 6. Crear Suscripciones
  console.log('💳 Creating subscriptions...');
  await Promise.all([
    prisma.subscription.create({
      data: {
        companyId: acmeCorp.id,
        planId: proPlan.id,
        status: 'active',
      },
    }),
    prisma.subscription.create({
      data: {
        companyId: acmeTech.id,
        planId: freePlan.id,
        status: 'trial',
        trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      },
    }),
    prisma.subscription.create({
      data: {
        companyId: acmeLogistics.id,
        planId: freePlan.id,
        status: 'active',
      },
    }),
    prisma.subscription.create({
      data: {
        companyId: globalInc.id,
        planId: enterprisePlan.id,
        status: 'active',
      },
    }),
    prisma.subscription.create({
      data: {
        companyId: globalServices.id,
        planId: proPlan.id,
        status: 'active',
      },
    }),
  ]);
  console.log('✅ Created 5 subscriptions');

  // 7. Crear Usuarios
  console.log('👤 Creating users...');

  const hashedPassword = await bcrypt.hash('Test123456!', 10);

  // Usuario de prueba
  const testUser = await prisma.user.create({
    data: {
      email: 'test@example.com',
      password: hashedPassword,
      name: 'Test',
      lastName: 'User',
      documentNumber: '1000000000',
      documentType: 'CC',
      phone: '+573100000000',
      companyId: acmeCorp.id,
    },
  });

  // Admin de ACME
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@acme.com',
      password: await bcrypt.hash('Admin123456!', 10),
      name: 'Carlos',
      lastName: 'Rodríguez',
      documentNumber: '1234567890',
      documentType: 'CC',
      phone: '+573101234567',
      companyId: acmeCorp.id,
    },
  });

  // Manager de ACME Tech
  const managerUser = await prisma.user.create({
    data: {
      email: 'manager@acmetech.com',
      password: await bcrypt.hash('Manager123456!', 10),
      name: 'María',
      lastName: 'González',
      documentNumber: '2345678901',
      documentType: 'CC',
      phone: '+573102345678',
      companyId: acmeTech.id,
    },
  });

  // Employee de ACME Logistics
  const employeeUser = await prisma.user.create({
    data: {
      email: 'employee@acmelogistics.com',
      password: await bcrypt.hash('Employee123456!', 10),
      name: 'Juan',
      lastName: 'Martínez',
      documentNumber: '3456789012',
      documentType: 'CC',
      phone: '+573103456789',
      companyId: acmeLogistics.id,
    },
  });

  // Admin de Global
  const globalAdmin = await prisma.user.create({
    data: {
      email: 'admin@global.com',
      password: await bcrypt.hash('Global123456!', 10),
      name: 'Ana',
      lastName: 'López',
      documentNumber: '4567890123',
      documentType: 'CC',
      phone: '+573104567890',
      companyId: globalInc.id,
    },
  });

  // Viewer de Global Services
  const viewerUser = await prisma.user.create({
    data: {
      email: 'viewer@globalservices.com',
      password: await bcrypt.hash('Viewer123456!', 10),
      name: 'Pedro',
      lastName: 'Sánchez',
      documentNumber: '5678901234',
      documentType: 'CE',
      phone: '+573105678901',
      companyId: globalServices.id,
    },
  });

  // Usuario con TI
  const youngUser = await prisma.user.create({
    data: {
      email: 'junior@acmetech.com',
      password: await bcrypt.hash('Junior123456!', 10),
      name: 'Sofía',
      lastName: 'Ramírez',
      documentNumber: '6789012345',
      documentType: 'TI',
      phone: '+573106789012',
      companyId: acmeTech.id,
    },
  });

  console.log('✅ Created 7 users');

  // 8. Asignar roles a usuarios
  console.log('🎭 Assigning roles to users...');

  await Promise.all([
    // Test user - admin en ACME
    prisma.userRole.create({
      data: {
        userId: testUser.id,
        roleId: adminRole.id,
        companyId: acmeCorp.id,
      },
    }),
    // Admin user - admin en ACME
    prisma.userRole.create({
      data: {
        userId: adminUser.id,
        roleId: adminRole.id,
        companyId: acmeCorp.id,
      },
    }),
    // Manager user - manager en ACME Tech
    prisma.userRole.create({
      data: {
        userId: managerUser.id,
        roleId: managerRole.id,
        companyId: acmeTech.id,
      },
    }),
    // Employee user - employee en ACME Logistics
    prisma.userRole.create({
      data: {
        userId: employeeUser.id,
        roleId: employeeRole.id,
        companyId: acmeLogistics.id,
      },
    }),
    // Global admin - admin en Global
    prisma.userRole.create({
      data: {
        userId: globalAdmin.id,
        roleId: adminRole.id,
        companyId: globalInc.id,
      },
    }),
    // Viewer user - viewer en Global Services
    prisma.userRole.create({
      data: {
        userId: viewerUser.id,
        roleId: viewerRole.id,
        companyId: globalServices.id,
      },
    }),
    // Young user - employee en ACME Tech
    prisma.userRole.create({
      data: {
        userId: youngUser.id,
        roleId: employeeRole.id,
        companyId: acmeTech.id,
      },
    }),
  ]);

  console.log('✅ Assigned roles to users');

  // 9. Crear algunas firmas
  console.log('✍️ Creating signatures...');

  await Promise.all([
    prisma.signature.create({
      data: {
        userId: adminUser.id,
        signature: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      },
    }),
    prisma.signature.create({
      data: {
        userId: managerUser.id,
        signature: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      },
    }),
  ]);

  console.log('✅ Created 2 signatures');

  // 10. Crear algunos registros enlazados
  console.log('🔗 Creating enlaced records...');

  const enlacedRecord1 = await prisma.enlacedRecords.create({
    data: {
      recordId: 'REC-2024-001',
      fromRecord: 'Sistema Externo A',
      companyId: acmeCorp.id,
    },
  });

  const enlacedRecord2 = await prisma.enlacedRecords.create({
    data: {
      recordId: 'REC-2024-002',
      fromRecord: 'Sistema Externo B',
      companyId: globalInc.id,
    },
  });

  // Vincular usuarios a registros
  await Promise.all([
    prisma.userEnlacedRecords.create({
      data: {
        enlacedRecordId: enlacedRecord1.id,
        userId: adminUser.id,
      },
    }),
    prisma.userEnlacedRecords.create({
      data: {
        enlacedRecordId: enlacedRecord2.id,
        userId: globalAdmin.id,
      },
    }),
  ]);

  console.log('✅ Created 2 enlaced records');

  console.log('\n🎉 Seed completed successfully!\n');
  console.log('📝 Test credentials:');
  console.log('   Email: test@example.com');
  console.log('   Password: Test123456!\n');
  console.log('👥 Other users:');
  console.log('   admin@acme.com / Admin123456! (Admin at ACME)');
  console.log('   manager@acmetech.com / Manager123456! (Manager at ACME Tech)');
  console.log('   employee@acmelogistics.com / Employee123456! (Employee at ACME Logistics)');
  console.log('   admin@global.com / Global123456! (Admin at Global)');
  console.log('   viewer@globalservices.com / Viewer123456! (Viewer at Global Services)');
  console.log('   junior@acmetech.com / Junior123456! (Employee at ACME Tech)\n');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
