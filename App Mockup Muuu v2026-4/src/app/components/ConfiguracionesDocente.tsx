// ============================================================
//  MUUU APP · ConfiguracionesDocente
//  Reutiliza la lógica de Configuraciones con el rol 'teacher'.
// ============================================================

import { Configuraciones } from './Configuraciones';

interface ConfiguracionesDocenteProps {
  onBack: () => void;
  onLogout: () => void;
  onNavigate?: (screen: string) => void;
}

export function ConfiguracionesDocente({ onBack, onLogout, onNavigate }: ConfiguracionesDocenteProps) {
  return (
    <Configuraciones
      onBack={onBack}
      userRole="teacher"
      onLogout={onLogout}
      onNavigate={onNavigate}
    />
  );
}