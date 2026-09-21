"use client";

import { motion } from "framer-motion";

const steps = [
  {
    step: "01",
    title: "Pilih skenario",
    description:
      "Tentukan domain bahaya yang ingin dipelajari: gempa tektonik perkotaan atau erupsi vulkanik stratovolcano.",
  },
  {
    step: "02",
    title: "Atur parameter",
    description:
      "Ubah variabel fungsional seperti magnitudo, kedalaman hiposenter, atau indeks eksplosivitas vulkanik (VEI).",
  },
  {
    step: "03",
    title: "Lihat dan pahami dampaknya",
    description:
      "Amati respons lingkungan 3D secara langsung dan pelajari korelasi sebab-akibat serta tindakan mitigasi yang tepat.",
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-20 px-6 max-w-6xl mx-auto border-t border-[#161F28]">
      <div className="mb-12">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#57C7D9] mb-2 font-mono">
          Alur Eksplorasi
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#F2F5F7] tracking-tight">
          Bagaimana cara kerjanya?
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map((item, index) => (
          <motion.div
            key={item.step}
            initial={{ opacity: 1, y: 0 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: index * 0.08 }}
            className="p-6 rounded-[14px] bg-[#111820] border border-[#202B36] hover:border-[#2C3B4A] transition-colors flex flex-col justify-between"
          >
            <div>
              <div className="text-xs font-mono font-semibold text-[#57C7D9] mb-4">
                {item.step}
              </div>
              <h3 className="text-lg font-semibold text-[#F2F5F7] mb-2 font-display">
                {item.title}
              </h3>
              <p className="text-sm text-[#A9B3BD] leading-relaxed">
                {item.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
