function toggleAccordion(id) {
  const content = document.getElementById(id);
  const icon = document.getElementById('icon-' + id);
  const isOpen = !content.classList.contains("hidden");

  content.classList.toggle("hidden");

  // Rotasi ikon
  if (isOpen) {
    icon.classList.remove("rotate-180");
  } else {
    icon.classList.add("rotate-180");
  }
}


$("#btnTambahTugas").click(function () {
  $("#formContainer").show();
  // Set default value
  $("#jenisHabit").val("pembentukan");
  $("#kategoriGroup").show();
  $("#kategoriTugas").val("harian");

  // Langsung render form default (harian)
  renderFormInputs("harian");
  $("#btnSimpan").show();
});

// tutup form input
$("#btnClose").click(function () {
  $("#formContainer").hide();
  $("#formInputs").hide().html("");
  $("#btnSimpan").hide();
  $("#jenisHabit").val("");
  $("#kategoriTugas").val("");
  $("#kategoriGroup").hide();
});

// Jika user ganti kategori
$("#kategoriTugas").change(function () {
  const kategori = $(this).val();
  renderFormInputs(kategori);
  $("#btnSimpan").show();
});


// Jika user ganti jenisHabit, kosongkan kategori & formInputs
$("#jenisHabit").change(function () {
  $("#kategoriGroup").show();
  $("#kategoriTugas").val("harian").trigger("change");
});

// Satu-satunya handler kategoriTugas yang benar
$("#kategoriTugas").change(function () {
  const kategori = $(this).val();
  renderFormInputs(kategori);
  $("#btnSimpan").show();
});



const hariList = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
const bulanList = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

function renderFormInputs(kategori) {
  const commonFields = `
    <input type="text" id="namaTugas" placeholder="Nama Kebiasaan" style="width: 100%; padding: 6px; margin-bottom: 8px;" />
    <textarea id="deskripsiTugas" placeholder="Deskripsi" style="width: 100%; padding: 6px; margin-bottom: 8px;"></textarea>
    <select id="prioritasTugas" style="width: 100%; padding: 6px; margin-bottom: 8px;">
      <option value="Tinggi">Tinggi</option>
      <option value="Sedang" selected>Sedang</option>
      <option value="Rendah">Rendah</option>
    </select>
    <input type="number" id="nominalHadiah" min="0" placeholder="Nominal Hadiah (Rp)" style="width: 100%; padding: 6px; margin-bottom: 8px;" />
  `;

  let extraField = "";

  if (kategori === "mingguan") {
    const hariMulai = new Date(); // hari ini
    const opsiHari = [];

    for (let i = 1; i <= 7; i++) {
      const nextDay = new Date(hariMulai);
      nextDay.setDate(hariMulai.getDate() + i);
      const hari = hariList[nextDay.getDay()];
      opsiHari.push({
        nama: hari,
        isDefault: hari === "Sabtu"
      });
    }

    const hariOptions = opsiHari.map(opt =>
      `<option value="${opt.nama.toLowerCase()}" ${opt.isDefault ? "selected" : ""}>${opt.nama}</option>`
    ).join("");

    extraField = `<select id="deadlineHari" style="width: 100%; padding: 6px; margin-bottom: 8px;">${hariOptions}</select>`;
  }

  else if (kategori === "bulanan") {
    const today = new Date();
    const tanggalOptions = [];
  
    // Ambil tahun dan bulan sekarang
    const tahun = today.getFullYear();
    const bulan = today.getMonth(); // 0-based
  
    // Ambil tanggal terakhir bulan ini
    const lastDateOfMonth = new Date(tahun, bulan + 1, 0); // otomatis dapat tanggal terakhir
    const lastDay = lastDateOfMonth.getDate();
    const lastDayStr = lastDateOfMonth.toISOString().split("T")[0];
  
    // Loop dari tanggal 1 sampai tanggal terakhir bulan ini
    for (let tgl = 1; tgl <= lastDay; tgl++) {
      const thisDate = new Date(tahun, bulan, tgl);
      const tanggalStr = thisDate.toISOString().split("T")[0];
      const label = `${tgl} ${bulanList[bulan]} ${tahun}`;
  
      tanggalOptions.push({
        value: tanggalStr,
        label,
        isDefault: tanggalStr === lastDayStr
      });
    }
  
    const optionTags = tanggalOptions.map(opt =>
      `<option value="${opt.value}" ${opt.isDefault ? "selected" : ""}>${opt.label}</option>`
    ).join("");
  
    extraField = `<select id="deadlineTanggal" style="width: 100%; padding: 6px; margin-bottom: 8px;">${optionTags}</select>`;
  }
  
  

  $("#formInputs").html(commonFields + extraField).show();
}





$(document).ready(function () {

  const akun = JSON.parse(localStorage.getItem("akun")) || { saldo: 0 };
  $("#saldoSekarang").text(`Rp ${akun.saldo.toLocaleString("id-ID")}`);









    // Tampilkan saldo
    function tampilkanSaldo() {
      const akun = JSON.parse(localStorage.getItem("akun")) || { saldo: 0 };
      $("#saldoSekarang").text(`Rp ${akun.saldo.toLocaleString("id-ID")}`);
    }
  
    tampilkanSaldo();
  
    // Klik tombol "Tarik Uang" untuk menampilkan input withdraw
    $("#btnWithdraw").click(function () {
      $("#formWithdraw").classList.remove()('hidden'); // toggle muncul/sembunyi
    });
  
    // Konfirmasi penarikan
    $("#konfirmasiWithdraw").click(function () {
      const akun = JSON.parse(localStorage.getItem("akun")) || { saldo: 0 };
      const nominal = parseInt($("#inputWithdraw").val());
  
      if (isNaN(nominal) || nominal <= 0) {
        alert("Masukkan nominal yang valid.");
        return;
      }
  
      if (nominal > akun.saldo) {
        alert("Saldo tidak mencukupi.");
        return;
      }
  
      const konfirmasi = confirm(`Yakin ingin menarik Rp ${nominal.toLocaleString("id-ID")} ?`);
      if (konfirmasi) {
        akun.saldo -= nominal;
        localStorage.setItem("akun", JSON.stringify(akun));
        tampilkanSaldo();
        alert("Penarikan berhasil!");
        $("#inputWithdraw").val("");
        $("#formWithdraw").slideUp(); // sembunyikan lagi
      }
    });
  



















  function getPriorityColorClass(prioritas) {
    switch (prioritas.toLowerCase()) {
      case "tinggi": return "bg-red-100 text-red-800";
      case "sedang": return "bg-yellow-100 text-yellow-800";
      case "rendah": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-700";
    }
  }

  function renderTugas(jenis, kategori) {
    const container = $('#daftar-rutinitas');
    container.empty();

    const dataTugas = JSON.parse(localStorage.getItem("dataTugas")) || {
      pembentukan: { harian: [], mingguan: [], bulanan: [] },
      pemusnahan: { harian: [], mingguan: [], bulanan: [] }
    };

    const pendingCash = JSON.parse(localStorage.getItem('pendingCash')) || [];
    const tugasList = dataTugas[jenis][kategori] || [];

    tugasList.forEach((tugas, index) => {
      const priorityClass = getPriorityColorClass(tugas.prioritas);
      const isChecked = pendingCash.some(p => p.id_tugas === tugas.id_tugas);
      const card = `
        <label class="block w-full">
          <div class="card shadow-md hover:shadow-lg transition-all duration-300 p-2 rounded-lg bg-white mb-3 border-l-4 border-violet-600 relative overflow-hidden group cursor-pointer select-none">
            <div class="absolute top-0 right-0 w-32 h-32 bg-violet-100 rounded-full -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div class="flex items-center justify-between relative">
              <div class="flex items-center gap-3">
                <div class="relative">
                  <input type="checkbox"
                    class="checkbox-tugas peer sr-only"
                    data-id="${tugas.id_tugas}"
                    data-kategori="${kategori}"
                    data-jenis="${jenis}"
                    ${isChecked ? 'checked' : ''}>

                  <div class="h-6 w-6 rounded-md border-2 border-violet-600 peer-checked:bg-violet-600 peer-checked:border-violet-600 transition-all duration-300 flex items-center justify-center">
                    <i class="bi bi-check-lg text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-300"></i>
                  </div>
                </div>
                <div>
                  <div class="flex items-center gap-2">
                    <span class="text-gray-800 font-medium group-hover:text-violet-600 transition-colors duration-300">${tugas.judul}</span>
                    <span class="px-2 py-0.5 text-xs rounded-full ${priorityClass}">Prioritas ${tugas.prioritas}</span>
                  </div>
                  <p class="text-sm text-gray-500">${tugas.deskripsi}</p>
                  <div class="mt-1 w-full bg-gray-200 rounded-full h-1.5">
                    <div class="bg-violet-600 h-1.5 rounded-full" style="width: ${tugas.poin / 100}%"></div>
                  </div>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-violet-600 font-semibold">${tugas.poin}</span>
                <i class="bi bi-coin text-yellow-500"></i>
              </div>
            </div>
          </div>
        </label>`;
      container.append(card);
    });
  }

  let currentJenis = "pembentukan";
  let currentKategori = "harian";
  renderTugas(currentJenis, currentKategori);

  $('#pembentukan').on('click', function () {
    currentJenis = 'pembentukan';
    $('#pembentukan a').addClass('bg-violet-800 text-white');
    $('#pemusnahan a').removeClass('bg-violet-800 text-white');
    renderTugas(currentJenis, currentKategori);
  });

  $('#pemusnahan').on('click', function () {
    currentJenis = 'pemusnahan';
    $('#pemusnahan a').addClass('bg-violet-800 text-white');
    $('#pembentukan a').removeClass('bg-violet-800 text-white');
    renderTugas(currentJenis, currentKategori);
  });

  $('#nav-repetision a').on('click', function () {
    $('#nav-repetision a').removeClass('bg-white text-violet-800');
    $(this).addClass('bg-white text-violet-800');
    currentKategori = $(this).attr('id');
    renderTugas(currentJenis, currentKategori);
  });





  // ===============================
  // ? saat tombol simpan di klik
  // ===============================
  $('#btnSimpan').click(function () {
    const jenis = $('#jenisHabit').val();
    const kategori = $('#kategoriTugas').val();
    const namaTugas = $('#namaTugas').val().trim();
    const deskripsi = $('#deskripsiTugas').val().trim();
    const prioritas = $('#prioritasTugas').val();
    const nominalHadiah = parseInt($('#nominalHadiah').val());
  
    if (!jenis || !kategori || !namaTugas || !prioritas || isNaN(nominalHadiah)) {
      alert('Semua field wajib diisi!');
      return;
    }
  
    let deadlineHari = "";
    let deadlineTanggal = "";
    let deadlineBulan = "";
    let deadlineTahun = "";
  
    const now = new Date();
  
    if (kategori === "mingguan") {
      const hariNama = $('#deadlineHari').val().trim(); // misal: "jumat"
      if (!hariNama) {
        alert('Hari deadline wajib diisi untuk tugas mingguan!');
        return;
      }
  
      const hariList = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
      const indexTarget = hariList.findIndex(h => h.toLowerCase() === hariNama.toLowerCase());
      const hariIni = now.getDay();
  
      let selisihHari = indexTarget - hariIni;
      if (selisihHari <= 0) selisihHari += 7;
  
      const deadlineDate = new Date(now);
      deadlineDate.setDate(now.getDate() + selisihHari);
  
      deadlineHari = deadlineDate.getDate();
      deadlineBulan = deadlineDate.getMonth() + 1; // ✅ jangan lupa +1
      deadlineTahun = deadlineDate.getFullYear();
    }
  
    if (kategori === "bulanan") {
      const deadlineInput = $('#deadlineTanggal').val();
      
      if (!deadlineInput) {
        alert('Tanggal deadline wajib diisi untuk tugas bulanan!');
        return;
      }
      
      const deadlineDate = new Date(deadlineInput);
      deadlineTanggal = deadlineDate.getDate() + 1;
      deadlineBulan = deadlineDate.getMonth() + 1; // ✅ Fix bulan offset
      console.log(deadlineTanggal);
      deadlineTahun = deadlineDate.getFullYear();
    }
  
    let dataTugas = JSON.parse(localStorage.getItem("dataTugas")) || {
      pembentukan: { harian: [], mingguan: [], bulanan: [] },
      pemusnahan: { harian: [], mingguan: [], bulanan: [] },
    };
  
    const semuaTugas = [
      ...dataTugas.pembentukan.harian,
      ...dataTugas.pembentukan.mingguan,
      ...dataTugas.pembentukan.bulanan,
      ...dataTugas.pemusnahan.harian,
      ...dataTugas.pemusnahan.mingguan,
      ...dataTugas.pemusnahan.bulanan
    ];
  
    const newTugas = {
      judul: namaTugas,
      deskripsi: deskripsi,
      prioritas: prioritas,
      poin: nominalHadiah,
      waktuTambah: new Date().toISOString(),
      id_tugas: generateIdUnik(semuaTugas),
    };
  
    if (kategori === "mingguan") {
      newTugas.deadlineHari = deadlineHari;
      newTugas.deadlineBulan = deadlineBulan;
      newTugas.deadlineTahun = deadlineTahun;
    }
  
    if (kategori === "bulanan") {
      newTugas.deadlineTanggal = deadlineTanggal;
      newTugas.deadlineBulan = deadlineBulan;
      newTugas.deadlineTahun = deadlineTahun;
    }
  
    dataTugas[jenis][kategori].push(newTugas);
    localStorage.setItem("dataTugas", JSON.stringify(dataTugas));

    // Jika jenis habit adalah PEMUSNAHAN, langsung masukkan ke pendingCash
    if (jenis === "pemusnahan") {
      let pendingCash = JSON.parse(localStorage.getItem("pendingCash")) || [];
    
      // Hindari duplikat
      const sudahAda = pendingCash.some(p => p.id_tugas === newTugas.id_tugas);
      if (!sudahAda) {
        const dataTugasBaru = {
          judul: newTugas.judul,
          id_tugas: newTugas.id_tugas,
          nominal: newTugas.poin,
          kategori: kategori,
          jenis: jenis,
          waktuTambah: new Date().toISOString()
        };
    
        // Tambahkan deadline sesuai kategori
        if (kategori === "mingguan") {
          if (newTugas.deadlineHari !== undefined) dataTugasBaru.deadlineHari = newTugas.deadlineHari;
          if (newTugas.deadlineBulan !== undefined) dataTugasBaru.deadlineBulan = newTugas.deadlineBulan;
          if (newTugas.deadlineTahun !== undefined) dataTugasBaru.deadlineTahun = newTugas.deadlineTahun;
        }
    
        if (kategori === "bulanan") {
          if (newTugas.deadlineTanggal !== undefined) dataTugasBaru.deadlineTanggal = newTugas.deadlineTanggal;
          if (newTugas.deadlineBulan !== undefined) dataTugasBaru.deadlineBulan = newTugas.deadlineBulan;
          if (newTugas.deadlineTahun !== undefined) dataTugasBaru.deadlineTahun = newTugas.deadlineTahun;
        }
    
        pendingCash.push(dataTugasBaru);
        localStorage.setItem("pendingCash", JSON.stringify(pendingCash));
      }
    }
    

  
    // reset form
    $('#formInputs').html('').addClass('hidden');
    $('#formContainer').addClass('hidden');
    $('#btnSimpan').addClass('hidden');
    $('#jenisHabit').val("");
    $('#kategoriTugas').val("");
    $('#kategoriGroup').addClass('hidden');
  
    renderTugas(jenis, kategori);
  });
  

  


  
});

$("#toggleSettings").click(function () {
  $("#pengaturanPanel").toggleClass("translate-x-full");
});






function renderPengaturanTugas() {
  const container = document.getElementById("daftarPengaturanTugas");
  container.innerHTML = "";
  const data = JSON.parse(localStorage.getItem("dataTugas")) || {
    pembentukan: { harian: [], mingguan: [], bulanan: [] },
    pemusnahan: { harian: [], mingguan: [], bulanan: [] },
  };

  Object.entries(data).forEach(([jenis, kategoriObj]) => {
    Object.entries(kategoriObj).forEach(([kategori, tugasList]) => {
      tugasList.forEach((tugas, index) => {
        const elemen = document.createElement("div");
        elemen.className = "flex justify-between items-center p-1 bg-violet-50 rounded shadow-sm";
        elemen.innerHTML = `
          <div>
            <p class="text-sm font-medium text-gray-800">${tugas.judul} ${jenis} - ${kategori}</p>
            <p class="text-xs text-gray-500"></p>
          </div>
          <div class="flex gap-2">
            <button class="edit-btn text-blue-600 text-sm" data-jenis="${jenis}" data-kategori="${kategori}" data-index="${index}">Edit</button>
            <button class="delete-btn text-red-600 text-sm" data-jenis="${jenis}" data-kategori="${kategori}" data-index="${index}">Hapus</button>
          </div>`;
        container.appendChild(elemen);
      });
    });
  });
}

// * tombol toggle sidebar
document.getElementById("daftarPengaturanTugas").addEventListener("click", function (e) {
  if (e.target.classList.contains("delete-btn")) {
    const jenis = e.target.dataset.jenis;
    const kategori = e.target.dataset.kategori;
    const index = parseInt(e.target.dataset.index);
    const data = JSON.parse(localStorage.getItem("dataTugas"));
    data[jenis][kategori].splice(index, 1);
    localStorage.setItem("dataTugas", JSON.stringify(data));
    renderPengaturanTugas();
  } else if (e.target.classList.contains("edit-btn")) {
    alert("Fitur edit akan ditambahkan nanti.");
  }
});

renderPengaturanTugas();




// *fungsi buatkan id unik
function generateIdUnik(dataTugas) {
  const karakter = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
  let id;
  do {
    id = "";
    for (let i = 0; i < 4; i++) {
      id += karakter.charAt(Math.floor(Math.random() * karakter.length));
    }
  } while (dataTugas.some(tugas => tugas.id_tugas === id));
  return id;
}




// ============================================================
// ✅ Bagian masukan tugas ke daftar pending saat di checklis
// ============================================================
$(document).on('change', '.checkbox-tugas', function () {
  const isChecked = $(this).is(':checked');
  const idTugas = $(this).data('id');
  const kategori = $(this).data('kategori');
  const jenis = $(this).data('jenis');

  const semuaTugas = JSON.parse(localStorage.getItem('dataTugas')) || {
    pembentukan: { harian: [], mingguan: [], bulanan: [] },
    pemusnahan: { harian: [], mingguan: [], bulanan: [] }
  };

  let pendingCash = JSON.parse(localStorage.getItem('pendingCash')) || [];
  const daftar = semuaTugas[jenis][kategori];
  const tugas = daftar.find(t => t.id_tugas === idTugas);

  if (!tugas) return;

  if (isChecked) {
    const dataTugasBaru = {
      id_tugas: tugas.id_tugas,
      judul: tugas.judul,
      nominal: tugas.poin,
      kategori: kategori,
      jenis: jenis,
      waktuTambah: new Date().toISOString()
    };

    // Tambahkan semua field deadline jika tersedia
    if (kategori === "mingguan") {
      if (tugas.deadlineHari !== undefined) dataTugasBaru.deadlineHari = tugas.deadlineHari;
      if (tugas.deadlineBulan !== undefined) dataTugasBaru.deadlineBulan = tugas.deadlineBulan;
      if (tugas.deadlineTahun !== undefined) dataTugasBaru.deadlineTahun = tugas.deadlineTahun;
    }

    if (kategori === "bulanan") {
      if (tugas.deadlineTanggal !== undefined) dataTugasBaru.deadlineTanggal = tugas.deadlineTanggal;
      if (tugas.deadlineBulan !== undefined) dataTugasBaru.deadlineBulan = tugas.deadlineBulan;
      if (tugas.deadlineTahun !== undefined) dataTugasBaru.deadlineTahun = tugas.deadlineTahun;
    }

    pendingCash.push(dataTugasBaru);
  } else {
    pendingCash = pendingCash.filter(u => u.id_tugas !== idTugas);
  }

  localStorage.setItem('pendingCash', JSON.stringify(pendingCash));
});





// ==============================================
// ? bagian pindahkan dari pendingCash ke saldo
// ==============================================

const now = new Date();
const tanggalHariIni = now.getDate() + 0;
const bulanIni = now.getMonth() + 1;
const tahunIni = now.getFullYear();

function cekDanPindahOtomatis() {
  const pendingCash = JSON.parse(localStorage.getItem("pendingCash")) || [];
  const akun = JSON.parse(localStorage.getItem("akun")) || { saldo: 0 };

  const now = new Date();
  const hariIni = now.toLocaleDateString('id-ID', { weekday: 'long' });


  const sisaTugas = [];

  pendingCash.forEach(tugas => {
    const waktuTambah = new Date(tugas.waktuTambah);
    const tanggalTugas = waktuTambah.getDate(); // hanya untuk harian

    let pindahkan = false;

 

    // ✅ HARIAN: Pindah keesokan harinya
    if (tugas.kategori === "harian" && tanggalHariIni > tanggalTugas) {
      pindahkan = true;
    }

    // ✅ MINGGUAN: deadlineHari & bandingkan juga tahun/bulan
    if (
      tugas.kategori === "mingguan" &&
      (
        tahunIni > (tugas.deadlineTahun || tahunIni) ||
        bulanIni > (tugas.deadlineBulan || bulanIni) ||
        tanggalHariIni > (tugas.deadlineHari || tanggalHariIni)
      )
    ) {
      pindahkan = true;
    }


    // ✅ BULANAN: deadlineTanggal + bulan + tahun 

    // misalkan deadlineTanggal nya 28 januwanri, sementara user membuka aplikasinya tanggal 2
    if (
      tugas.kategori === "bulanan" &&
      (
        tahunIni > (tugas.deadlineTahun || tahunIni) ||
        bulanIni > (tugas.deadlineBulan || bulanIni) ||
        tanggalHariIni >= (tugas.deadlineTanggal || tanggalHariIni + 1)
      )
    ) {
      pindahkan = true;
    }

    if (pindahkan) {

      
      // Uncheck checkbox di halaman (jika ada)
      
      const checkbox = document.querySelector(`input[type="checkbox"][data-id="${tugas.id_tugas}"]`);

      if(tugas.jenis === "pembentukan") {
        akun.saldo += tugas.nominal;
        if (checkbox) checkbox.checked = false;
      } else {
        sisaTugas.push(tugas);
        if (checkbox) checkbox.checked = true;
        akun.saldo += tugas.nominal;
      }
    } else {
      sisaTugas.push(tugas);
    }

  });

  localStorage.setItem("pendingCash", JSON.stringify(sisaTugas));
  localStorage.setItem("akun", JSON.stringify(akun));

  
}




function tambahkanPemusnahanYangBelumMasuk() {
  const pendingCash = JSON.parse(localStorage.getItem("pendingCash")) || [];
  const semuaTugas = JSON.parse(localStorage.getItem("dataTugas")) || {
    pembentukan: { harian: [], mingguan: [], bulanan: [] },
    pemusnahan: { harian: [], mingguan: [], bulanan: [] }
  };



  const semuaPemusnahan = [
    ...semuaTugas.pemusnahan.harian.map(t => ({ ...t, kategori: "harian" })),
    ...semuaTugas.pemusnahan.mingguan.map(t => ({ ...t, kategori: "mingguan" })),
    ...semuaTugas.pemusnahan.bulanan.map(t => ({ ...t, kategori: "bulanan" }))
  ];

  semuaPemusnahan.forEach(tugas => {

    const waktuTambah = new Date(tugas.waktuTambah);
    const tanggalTugas = waktuTambah.getDate(); // hanya untuk harian

    const sudahAda = pendingCash.some(p => p.id_tugas === tugas.id_tugas);
    if (sudahAda) return; // Skip kalau sudah masuk

    let waktunyaMasuk = false;


    if (tugas.kategori === "harian" && tanggalHariIni > tanggalTugas ) {
      waktunyaMasuk = true;
    }

    if (tugas.kategori === "mingguan") {
      if (
        tahunIni > (tugas.deadlineTahun || tahunIni) ||
        bulanIni > (tugas.deadlineBulan || bulanIni) ||
        tanggalHariIni > (tugas.deadlineHari || tanggalHariIni)
      ) {
        waktunyaMasuk = true;
      }
    }

    if (tugas.kategori === "bulanan") {
      if (
        tahunIni > (tugas.deadlineTahun || tahunIni) ||
        bulanIni > (tugas.deadlineBulan || bulanIni) ||
        tanggalHariIni >= (tugas.deadlineTanggal || tanggalHariIni + 1)
      ) {
        waktunyaMasuk = true;
      }
    }

    if (waktunyaMasuk) {
      pendingCash.push({
        id_tugas: tugas.id_tugas,
        judul: tugas.judul,
        nominal: tugas.poin,
        jenis: "pemusnahan",
        kategori: tugas.kategori,
        waktuTambah: new Date().toISOString(),
        deadlineHari: tugas.deadlineHari,
        deadlineBulan: tugas.deadlineBulan,
        deadlineTahun: tugas.deadlineTahun,
        deadlineTanggal: tugas.deadlineTanggal
      });

      const checkbox = document.querySelector(`input[type="checkbox"][data-id="${tugas.id_tugas}"]`);
      if (checkbox) checkbox.checked = true;
    }
  });

  localStorage.setItem("pendingCash", JSON.stringify(pendingCash));
}


window.addEventListener("load", () => {
  cekDanPindahOtomatis();
  tambahkanPemusnahanYangBelumMasuk();
});













