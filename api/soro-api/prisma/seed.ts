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
  await prisma.company.deleteMany();

  // 1. Crear Permisos
  console.log('📋 Creating permissions...');
  const permissions = await Promise.all([
    // User permissions
    prisma.permission.create({
      data: {
        name: 'users.create',
        description: 'Create new users',
      },
    }),
    prisma.permission.create({
      data: {
        name: 'users.read',
        description: 'View users',
      },
    }),
    prisma.permission.create({
      data: {
        name: 'users.update',
        description: 'Update users',
      },
    }),
    prisma.permission.create({
      data: {
        name: 'users.delete',
        description: 'Delete users',
      },
    }),
    // Company permissions
    prisma.permission.create({
      data: {
        name: 'companies.create',
        description: 'Create new companies',
      },
    }),
    prisma.permission.create({
      data: {
        name: 'companies.read',
        description: 'View companies',
      },
    }),
    prisma.permission.create({
      data: {
        name: 'companies.update',
        description: 'Update companies',
      },
    }),
    prisma.permission.create({
      data: {
        name: 'companies.delete',
        description: 'Delete companies',
      },
    }),
    // Role permissions
    prisma.permission.create({
      data: {
        name: 'roles.create',
        description: 'Create new roles',
      },
    }),
    prisma.permission.create({
      data: {
        name: 'roles.read',
        description: 'View roles',
      },
    }),
    prisma.permission.create({
      data: {
        name: 'roles.update',
        description: 'Update roles',
      },
    }),
    prisma.permission.create({
      data: {
        name: 'roles.delete',
        description: 'Delete roles',
      },
    }),
    // Records permissions
    prisma.permission.create({
      data: {
        name: 'records.create',
        description: 'Create records',
      },
    }),
    prisma.permission.create({
      data: {
        name: 'records.read',
        description: 'View records',
      },
    }),
    prisma.permission.create({
      data: {
        name: 'records.update',
        description: 'Update records',
      },
    }),
    prisma.permission.create({
      data: {
        name: 'records.delete',
        description: 'Delete records',
      },
    }),
  ]);

  console.log(`✅ Created ${permissions.length} permissions`);

  // 2. Crear Roles
  console.log('👥 Creating roles...');
  const adminRole = await prisma.role.create({
    data: {
      name: 'admin',
    },
  });

  const managerRole = await prisma.role.create({
    data: {
      name: 'manager',
    },
  });

  const employeeRole = await prisma.role.create({
    data: {
      name: 'employee',
    },
  });

  const viewerRole = await prisma.role.create({
    data: {
      name: 'viewer',
    },
  });

  console.log('✅ Created 4 roles');

  // 3. Asignar permisos a roles
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

  // 4. Crear Empresas
  console.log('🏢 Creating companies...');

  // Empresa matriz
  const acmeCorp = await prisma.company.create({
    data: {
      name: 'ACME Corporation',
      nit: '900123456-7',
      address: 'Calle 100 #15-20, Bogotá',
      phone: '+573001234567',
    },
  });

  // Subsidiarias de ACME
  const acmeTech = await prisma.company.create({
    data: {
      name: 'ACME Tech Solutions',
      nit: '900234567-8',
      address: 'Carrera 7 #71-21, Bogotá',
      phone: '+573002345678',
      parentId: acmeCorp.id,
    },
  });

  const acmeLogistics = await prisma.company.create({
    data: {
      name: 'ACME Logistics',
      nit: '900345678-9',
      address: 'Avenida 68 #25-47, Bogotá',
      phone: '+573003456789',
      parentId: acmeCorp.id,
    },
  });

  // Otra empresa independiente
  const globalInc = await prisma.company.create({
    data: {
      name: 'Global Industries Inc',
      nit: '900456789-0',
      address: 'Calle 26 #92-32, Bogotá',
      phone: '+573004567890',
    },
  });

  // Subsidiaria de Global
  const globalServices = await prisma.company.create({
    data: {
      name: 'Global Services',
      nit: '900567890-1',
      address: 'Carrera 15 #93-40, Bogotá',
      phone: '+573005678901',
      parentId: globalInc.id,
    },
  });

  console.log('✅ Created 5 companies');

  // 5. Crear Usuarios
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

  // 6. Asignar roles a usuarios
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

  // 7. Crear algunas firmas
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

  // 8. Crear algunos registros enlazados
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
