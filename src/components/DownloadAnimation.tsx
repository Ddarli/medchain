import React from 'react';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';

interface DownloadAnimationProps {
  onComplete: () => void;
}

export const DownloadAnimation: React.FC<DownloadAnimationProps> = ({ onComplete }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onComplete}
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ 
          scale: 1,
          opacity: 1,
          transition: { duration: 0.3 }
        }}
        exit={{ scale: 0.5, opacity: 0 }}
        className="bg-white dark:bg-gray-800 rounded-lg p-8 flex flex-col items-center"
        onClick={e => e.stopPropagation()}
      >
        <motion.div
          animate={{
            y: [0, -10, 0],
            transition: {
              duration: 1,
              repeat: Infinity,
              repeatType: "reverse"
            }
          }}
          className="mb-4"
        >
          <Download className="w-12 h-12 text-blue-500" />
        </motion.div>
        <motion.div
          initial={{ width: 0 }}
          animate={{ 
            width: "100%",
            transition: { duration: 2 }
          }}
          onAnimationComplete={onComplete}
          className="h-2 bg-blue-500 rounded-full w-48"
        />
        <p className="mt-4 text-gray-600 dark:text-gray-300">Downloading...</p>
      </motion.div>
    </motion.div>
  );
};