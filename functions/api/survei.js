export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const data = await request.json();
    const { nama_masjid, kelurahan, alamat, tahun_berdiri, kapasitas, fasilitas, kegiatan_rutin, ketua, kontak, keterangan } = data || {};

    if (!nama_masjid || !kelurahan) {
      return new Response(JSON.stringify({ message: 'Nama masjid dan kelurahan wajib diisi.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Simpan data ke D1 database jika sudah ter-binding dengan nama DB
    if (env.DB) {
      await env.DB.prepare(
        'INSERT INTO survei_masjid (nama_masjid, kelurahan, alamat, tahun_berdiri, kapasitas, fasilitas, kegiatan_rutin, ketua, kontak, keterangan) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
      ).bind(nama_masjid, kelurahan, alamat, tahun_berdiri, kapasitas, fasilitas, kegiatan_rutin, ketua, kontak, keterangan).run();
    }

    return new Response(JSON.stringify({ message: 'Survei berhasil dikirim.' }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Terjadi kesalahan server.', detail: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
