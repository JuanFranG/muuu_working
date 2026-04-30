import { motion } from 'motion/react';

export function LoadingScreen() {
  return (
    <div className="h-full bg-gradient-to-b from-sky-200 to-sky-300 flex flex-col items-center justify-center">
      {/* Logo de Propósitos Colombia */}
      <div className="mb-8">
        <div className="bg-white rounded-full p-4 shadow-lg">
          <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">PC</span>
          </div>
        </div>
      </div>

      {/* Golondrina animada */}
      <div className="relative">
        <motion.svg
          width="80"
          height="60"
          viewBox="0 0 80 60"
          className="mb-4"
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {/* Cuerpo de la golondrina - amarillo pastel */}
          <ellipse cx="40" cy="35" rx="8" ry="12" fill="#F9E71E" />
          
          {/* Cabeza - azul zafiro */}
          <circle cx="40" cy="20" r="8" fill="#0F52BA" />
          
          {/* Pico */}
          <polygon points="40,15 35,18 40,21" fill="#FFA500" />
          
          {/* Ojo */}
          <circle cx="42" cy="18" r="2" fill="white" />
          <circle cx="43" cy="17" r="1" fill="black" />
          
          {/* Alas - blanco hueso con animación */}
          <motion.path
            d="M32 30 Q20 25 15 35 Q20 40 32 35 Z"
            fill="#F8F8FF"
            stroke="#E5E5E5"
            strokeWidth="1"
            animate={{
              rotate: [0, -15, 0, 15, 0],
            }}
            transition={{
              duration: 0.4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{ transformOrigin: "32px 32px" }}
          />
          <motion.path
            d="M48 30 Q60 25 65 35 Q60 40 48 35 Z"
            fill="#F8F8FF"
            stroke="#E5E5E5"
            strokeWidth="1"
            animate={{
              rotate: [0, 15, 0, -15, 0],
            }}
            transition={{
              duration: 0.4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{ transformOrigin: "48px 32px" }}
          />
          
          {/* Cola - blanco hueso */}
          <path d="M40 47 Q35 52 30 55 Q40 50 45 55 Q40 50 40 47 Z" fill="#F8F8FF" stroke="#E5E5E5" strokeWidth="1" />
        </motion.svg>
      </div>

      {/* Texto de carga */}
      <motion.div
        className="text-blue-800 text-lg font-medium"
        animate={{
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        SitBax
      </motion.div>
    </div>
  );
}