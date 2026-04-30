# Flujo de "Ponte a Prueba" - Documentación

## Descripción del Flujo

El flujo de "Ponte a Prueba" consiste en DOS pantallas separadas:

1. **PonteAPruebaDocentes** - Pantalla de selección de docente
2. **PonteAPrueba** - Pantalla del quiz con flashcards

## Flujo Completo

```
StudentHome 
    ↓ (click en botón "Ponte a Prueba")
PonteAPruebaDocentes (Selección de Docente)
    ↓ (click en botón "Practicar" de un docente)
PonteAPrueba (Quiz de Flashcards)
    ↓ (click en botón "Volver")
PonteAPruebaDocentes
    ↓ (click en botón "Volver")
StudentHome
```

## Archivos Críticos

### 1. MuuuApp.tsx

**Import necesario:**
```typescript
import { PonteAPruebaDocentes } from './PonteAPruebaDocentes';
```

**AppState type debe incluir:**
```typescript
type AppState = '...' | 'ponteAPruebaDocentes' | 'ponteAPrueba' | '...';
```

**Handlers en el orden correcto (ponteAPruebaDocentes ANTES de ponteAPrueba):**
```typescript
  if (appState === 'ponteAPruebaDocentes') {
    return (
      <>
        <PonteAPruebaDocentes
          onBack={() => setAppState('studentHome')}
          onSelectTeacher={(teacherId) => {
            console.log('Selected teacher:', teacherId);
            setAppState('ponteAPrueba');
          }}
        />
        <NavButtons />
      </>
    );
  }

  if (appState === 'ponteAPrueba') {
    return (
      <>
        <PonteAPrueba onBack={() => setAppState('ponteAPruebaDocentes')} />
        <NavButtons />
      </>
    );
  }
```

**Menú de navegación rápida:**
```typescript
<button onClick={() => navigateToScreen('ponteAPruebaDocentes')}>
  🏆 Ponte a Prueba
</button>
```

### 2. StudentHome.tsx

**Botón debe apuntar a 'ponteAPruebaDocentes':**
```typescript
<button onClick={() => onNavigate('ponteAPruebaDocentes')}>
  Ponte a Prueba
</button>
```

### 3. PonteAPruebaDocentes.tsx

**Props correctas:**
```typescript
interface PonteAPruebaDocentesProps {
  onBack: () => void;
  onSelectTeacher: (teacherId: string) => void;
}
```

### 4. PonteAPrueba.tsx

**Props correctas:**
```typescript
interface PonteAPruebaProps {
  onBack: () => void;
}
```

## Puntos Críticos para NO Romper el Flujo

1. **NUNCA** eliminar el import de `PonteAPruebaDocentes` en MuuuApp.tsx
2. **NUNCA** cambiar el orden de los handlers (ponteAPruebaDocentes debe ir ANTES de ponteAPrueba)
3. **SIEMPRE** incluir 'ponteAPruebaDocentes' en el tipo AppState
4. **SIEMPRE** hacer que el botón de StudentHome apunte a 'ponteAPruebaDocentes', NO a 'ponteAPrueba'
5. **SIEMPRE** hacer que el botón volver de PonteAPrueba regrese a 'ponteAPruebaDocentes', NO a 'studentHome'

## Verificación Rápida

Para verificar que el flujo está correctamente configurado:

1. Buscar en MuuuApp.tsx: `import { PonteAPruebaDocentes }` ✓
2. Buscar en MuuuApp.tsx: `'ponteAPruebaDocentes'` en AppState ✓
3. Buscar en MuuuApp.tsx: handler de 'ponteAPruebaDocentes' ✓
4. Verificar que el handler de 'ponteAPrueba' tenga `onBack={() => setAppState('ponteAPruebaDocentes')}` ✓
5. Buscar en StudentHome.tsx: `onNavigate('ponteAPruebaDocentes')` ✓

## Última Actualización

Fecha: 2026-04-21
Estado: ✅ FLUJO CORREGIDO Y DOCUMENTADO
