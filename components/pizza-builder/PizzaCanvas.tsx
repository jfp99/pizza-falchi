'use client';
import { motion, AnimatePresence } from 'framer-motion';

interface PizzaCanvasProps {
  size: any;
  crust: any;
  toppings: any[];
  theme: string;
}

export default function PizzaCanvas({ size, crust, toppings, theme }: PizzaCanvasProps) {
  // Scale based on size
  const scale = size.size / 31; // 31 is medium size

  return (
    <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-3xl p-8 shadow-2xl overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-primary-yellow rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-primary-red rounded-full blur-3xl" />
      </div>

      {/* Pizza Container */}
      <div className="relative w-full aspect-square flex items-center justify-center">
        <motion.div
          className="relative pizza-rotate"
          style={{
            transform: `scale(${scale})`,
            width: '300px',
            height: '300px',
          }}
          transition={{ type: 'spring', stiffness: 100 }}
        >
          <style jsx>{`
            .pizza-rotate {
              animation: rotate 60s linear infinite;
            }
            @keyframes rotate {
              from {
                transform: rotate(0deg) scale(${scale});
              }
              to {
                transform: rotate(360deg) scale(${scale});
              }
            }
            .topping-counter-rotate {
              animation: counter-rotate 60s linear infinite;
            }
            @keyframes counter-rotate {
              from {
                transform: rotate(0deg);
              }
              to {
                transform: rotate(-360deg);
              }
            }
          `}</style>
          {/* Pizza Base */}
          <motion.div
            className="absolute inset-0 rounded-full shadow-2xl"
            style={{
              background: crust.id === 'cheesy'
                ? 'linear-gradient(135deg, #D2691E 0%, #FFD700 50%, #D2691E 100%)'
                : crust.id === 'thin'
                ? 'linear-gradient(135deg, #CD853F 0%, #DEB887 100%)'
                : crust.id === 'thick'
                ? 'linear-gradient(135deg, #8B4513 0%, #D2691E 100%)'
                : 'linear-gradient(135deg, #D2691E 0%, #F4A460 100%)',
              border: crust.id === 'cheesy' ? '12px solid #FFD700' : '8px solid #8B4513',
            }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          />

          {/* Sauce Layer */}
          {toppings.filter(t => t.id === 'tomato' || t.id === 'cream' || t.id === 'bbq' || t.id === 'pesto').map((sauce) => (
            <motion.div
              key={sauce.id}
              className="absolute inset-4 rounded-full"
              style={{
                background:
                  sauce.id === 'tomato' ? 'radial-gradient(circle, #FF6B6B, #DC143C)' :
                  sauce.id === 'cream' ? 'radial-gradient(circle, #FFFACD, #F5F5DC)' :
                  sauce.id === 'bbq' ? 'radial-gradient(circle, #A0522D, #8B4513)' :
                  'radial-gradient(circle, #90EE90, #228B22)',
                opacity: 0.9,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.9 }}
              transition={{ duration: 0.5 }}
            />
          ))}

          {/* Cheese Layer */}
          {toppings.filter(t => t.id === 'mozzarella' || t.id === 'chevre' || t.id === 'gorgonzola' || t.id === 'parmesan').map((cheese) => (
            <motion.div
              key={cheese.id}
              className="absolute inset-6 rounded-full"
              style={{
                background: `radial-gradient(circle, ${cheese.color}CC, ${cheese.color}88)`,
                opacity: 0.7,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 0.7, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            />
          ))}

          {/* Toppings */}
          <AnimatePresence>
            {toppings.filter(t => !['tomato', 'cream', 'bbq', 'pesto', 'mozzarella', 'chevre', 'gorgonzola', 'parmesan'].includes(t.id)).map((topping, index) => {
              // Generate random positions for toppings
              const positions = Array.from({ length: 8 }, (_, i) => {
                const angle = (i * 45 + index * 15) * Math.PI / 180;
                const radius = 60 + (i % 3) * 30;
                return {
                  x: Math.cos(angle) * radius + 150,
                  y: Math.sin(angle) * radius + 150,
                };
              });

              return positions.map((pos, i) => (
                <motion.div
                  key={`${topping.id}-${i}`}
                  className="absolute w-8 h-8 rounded-full flex items-center justify-center topping-counter-rotate"
                  style={{
                    left: pos.x - 16,
                    top: pos.y - 16,
                  }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                >
                  {/* Topping visual representation */}
                  <div
                    className="w-full h-full rounded-full shadow-md"
                    style={{
                      background: topping.color,
                      opacity: 0.9,
                      border: '1px solid rgba(0,0,0,0.1)',
                    }}
                  />
                </motion.div>
              ));
            })}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Size indicator */}
      <div className="absolute bottom-4 right-4 bg-white dark:bg-gray-700 px-3 py-2 rounded-lg shadow-lg">
        <p className="text-xs text-gray-600 dark:text-gray-300">Taille</p>
        <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{size.name} ({size.size}cm)</p>
      </div>

      {/* Sparkle effects for premium feel */}
      <motion.div
        className="absolute top-4 right-4"
        animate={{
          rotate: [0, 360],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 2L14.09 8.26L20.18 9.27L15.54 13.14L17.09 19.18L12 16L6.91 19.18L8.46 13.14L3.82 9.27L9.91 8.26L12 2Z"
            fill="#FFD700"
            stroke="#FFD700"
            strokeWidth="2"
          />
        </svg>
      </motion.div>
    </div>
  );
}