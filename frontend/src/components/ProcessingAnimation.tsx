import { motion } from "framer-motion";
import { Loader2, ArrowRight } from "lucide-react";

interface ProcessingAnimationProps {
  currentStep: "before" | "processing" | "after";
}

export function ProcessingAnimation({ currentStep }: ProcessingAnimationProps) {
  if (currentStep === "before") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-8"
      >
        <div className="text-6xl mb-4">🎵</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Ready to Process Settlement
        </h3>
        <p className="text-gray-600">
          Click the button below to start the settlement process
        </p>
      </motion.div>
    );
  }

  if (currentStep === "processing") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-8"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="mx-auto w-16 h-16 mb-4"
        >
          <Loader2 className="w-16 h-16 text-primary-600" />
        </motion.div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Processing Settlement...
        </h3>
        <p className="text-gray-600">
          Creating XRPL transactions and updating balances
        </p>

        <div className="mt-6 space-y-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-center space-x-2 text-sm text-gray-600"
          >
            <ArrowRight className="w-4 h-4" />
            <span>Simulating music usage...</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1 }}
            className="flex items-center justify-center space-x-2 text-sm text-gray-600"
          >
            <ArrowRight className="w-4 h-4" />
            <span>Creating XRPL transactions...</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.5 }}
            className="flex items-center justify-center space-x-2 text-sm text-gray-600"
          >
            <ArrowRight className="w-4 h-4" />
            <span>Updating balances...</span>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  if (currentStep === "after") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center py-8"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="text-6xl mb-4"
        >
          ✅
        </motion.div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Settlement Complete!
        </h3>
        <p className="text-gray-600">
          All transactions have been processed successfully
        </p>
      </motion.div>
    );
  }

  return null;
}
