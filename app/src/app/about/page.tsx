export default function AboutPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 px-6 max-w-3xl mx-auto bg-[#0B0F14] text-[#F2F5F7]">
      <div className="mb-10">
        <p className="text-xs font-mono font-medium uppercase tracking-wider text-[#57C7D9] mb-2">
          Transparansi Metodologi & Kredibilitas (§54)
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-[#F2F5F7] mb-2 font-display">
          Cara kerja dan batasan simulator
        </h1>
        <p className="text-sm text-[#A9B3BD]">
          Memahami prinsip penyederhanaan model edukatif, sumber data resmi, dan batasan simulasi.
        </p>
      </div>

      <div className="space-y-8">
        {/* Scientific Integrity */}
        <div className="rounded-[14px] border border-[#202B36] bg-[#111820] p-7">
          <h2 className="text-lg font-bold text-[#F2F5F7] mb-3 font-display">
            Integritas Ilmiah & Asumsi Model
          </h2>
          <p className="text-xs text-[#A9B3BD] leading-relaxed mb-4">
            Simulator ini merupakan instrumen visualisasi pembelajaran interaktif. Visualisasi respons struktur, amplifikasi tanah, dan jangkauan material erupsi merupakan pendekatan terstruktur matematis yang disederhanakan agar dapat beroperasi secara real-time di peramban web tanpa memerlukan superkomputer geofisika.
          </p>
          <div className="rounded-[10px] bg-[#18212B] border border-[#202B36] p-4 text-xs">
            <span className="font-mono text-[#D6A84F] font-semibold block mb-1">
              Catatan Penting:
            </span>
            <p className="text-[#A9B3BD] leading-relaxed">
              Model visual edukatif ini tidak ditujukan untuk kalkulasi rekayasa struktur riil atau sistem peringatan dini darurat. Untuk data pemantauan waktu-nyata resmi, selalu rujuk kanal resmi BMKG dan PVMBG.
            </p>
          </div>
        </div>

        {/* Data Sources */}
        <div id="sources" className="rounded-[14px] border border-[#202B36] bg-[#111820] p-7">
          <h2 className="text-lg font-bold text-[#F2F5F7] mb-4 font-display">
            Rujukan Sumber Data Resmi
          </h2>
          <div className="space-y-3">
            {[
              {
                name: "BMKG",
                tag: "Geofisika & Seismologi",
                desc: "Badan Meteorologi, Klimatologi, dan Geofisika: parameter magnitudo, kedalaman hiposenter, dan pemetaan intensitas guncangan (MMI).",
              },
              {
                name: "PVMBG",
                tag: "Vulkanologi & Mitigasi Bencana Geologi",
                desc: "Badan Geologi Kementerian ESDM: data tipologi erupsi, pemetaan Kawasan Rawan Bencana (KRB I, II, III), dan dinamika kubah lava.",
              },
              {
                name: "BNPB / inaRISK",
                tag: "Kajian Risiko Kebencanaan Spasial",
                desc: "Badan Nasional Penanggulangan Bencana: data sebaran permukiman terpapar, indeks kerentanan sosial, dan pedoman evakuasi mandiri.",
              },
            ].map((source) => (
              <div
                key={source.name}
                className="p-4 rounded-[10px] bg-[#18212B] border border-[#202B36]"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <h3 className="text-xs font-semibold text-[#57C7D9] font-mono">
                    {source.name}
                  </h3>
                  <span className="text-[10px] text-[#6F7B86] font-mono">
                    {source.tag}
                  </span>
                </div>
                <p className="text-xs text-[#A9B3BD] leading-relaxed">
                  {source.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Approach */}
        <div id="project" className="rounded-[14px] border border-[#202B36] bg-[#111820] p-7">
          <h2 className="text-lg font-bold text-[#F2F5F7] mb-3 font-display">
            Pendekatan Visual
          </h2>
          <p className="text-xs text-[#A9B3BD] leading-relaxed mb-4">
            Kami mengutamakan kejelasan sebab-akibat (cause and effect) daripada efek visual yang tidak memiliki dasar fungsional:
          </p>
          <ul className="space-y-2.5 text-xs text-[#A9B3BD]">
            <li className="flex items-start gap-2.5">
              <span className="text-[#57C7D9] font-mono shrink-0">01</span>
              <span>
                <strong className="text-[#F2F5F7]">Fisika Sederhana yang Dapat Diamati:</strong> Parameter numerik (magnitudo, kedalaman, VEI) langsung menentukan amplifikasi getaran dan radius bahaya pada model 3D.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-[#57C7D9] font-mono shrink-0">02</span>
              <span>
                <strong className="text-[#F2F5F7]">Tanpa Dekorasi Kosong:</strong> Setiap indikator warna dan batas garis pada simulasi mencerminkan ambang batas bahaya (seperti percepatan gravitasi tanah atau jangkauan awan panas).
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-[#57C7D9] font-mono shrink-0">03</span>
              <span>
                <strong className="text-[#F2F5F7]">Berorientasi Mitigasi:</strong> Pengalaman belajar ditutup dengan langkah tindakan nyata yang dapat diambil pengguna dalam situasi nyata.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
