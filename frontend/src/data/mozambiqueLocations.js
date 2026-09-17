// Dados Oficiais de Províncias e Cidades/Bairros de Moçambique
export const MZ_PROVINCES = [
    {
        name: 'Sofala',
        capital: 'Beira',
        bairros: [
            'Macuti (Beira)', 'Ponta Gêa (Beira)', 'Maquinino (Beira)', 'Munhava (Beira)',
            'Manga (Beira)', 'Estoril (Beira)', 'Chota (Beira)', 'Inhamízua (Beira)',
            'Matacuane (Beira)', 'Macurungo (Beira)', 'Chaimite (Beira)', 'Maraza (Beira)',
            'Chingussura (Beira)', 'Vaz (Beira)', 'Pioneiros (Beira)', 'Dondo', 'Nhamatanda', 'Búzi', 'Gorongosa'
        ]
    },
    {
        name: 'Maputo Cidade',
        capital: 'Maputo',
        bairros: [
            'Polana Cimento', 'Central', 'Alto Maé', 'Malhangalene', 'Sommerschield',
            'Coop', 'Maxaquene', 'Polana Caniço', 'Chamanculo', 'Mavalane',
            'Aeroporto', 'Zimpeto', 'Hulene', 'Costa do Sol', 'Triunfo', 'Bairro do Jardim'
        ]
    },
    {
        name: 'Maputo Província',
        capital: 'Matola',
        bairros: [
            'Matola C', 'Matola Rio', 'Matola F', 'Matola 700', 'Machava',
            'Trevo', 'Malhampsene', 'Tsalala', 'Liberdade', 'Infulene',
            'Boane', 'Marracuene', 'Manhiça', 'Namaacha'
        ]
    },
    {
        name: 'Nampula',
        capital: 'Nampula',
        bairros: [
            'Central (Nampula)', 'Muatala', 'Muhala', 'Natikiri', 'Carrupeia',
            'Namutequeliua', 'Marrere', 'Nacala Porto', 'Ilha de Moçambique', 'Angoche', 'Monapo'
        ]
    },
    {
        name: 'Zambézia',
        capital: 'Quelimane',
        bairros: [
            'Central (Quelimane)', 'Sinacura', 'Chulemane', 'Torrone', 'Sagrada Família',
            'Coalane', 'Madal', 'Mocuba', 'Gurúè', 'Milange'
        ]
    },
    {
        name: 'Tete',
        capital: 'Tete',
        bairros: [
            'Francisco Manyanga', 'Josina Machel', 'Chingodzi', 'Matundo', 'Degue',
            'Samora Machel', 'Moatize', 'Ulongué', 'Songo'
        ]
    },
    {
        name: 'Manica',
        capital: 'Chimoio',
        bairros: [
            'Centro Hípico', 'Vila Nova', 'Chissui', 'Soalpo', 'Eduardo Mondlane',
            'Nhamaonha', 'Manica', 'Gondola', 'Catandica'
        ]
    },
    {
        name: 'Inhambane',
        capital: 'Inhambane',
        bairros: [
            'Balane', 'Chamane', 'Muele', 'Salela', 'Maxixe (Centro)',
            'Rumbana', 'Vilankulo', 'Morrumbene', 'Massinga', 'Zavala'
        ]
    },
    {
        name: 'Gaza',
        capital: 'Xai-Xai',
        bairros: [
            'Praia de Xai-Xai', 'Bairro 2', 'Bairro 3', 'Bairro 4', 'Patrice Lumumba',
            'Chókwè', 'Bilene', 'Mandlakazi', 'Macarene'
        ]
    },
    {
        name: 'Cabo Delgado',
        capital: 'Pemba',
        bairros: [
            'Wimbe', 'Alto Gingone', 'Natite', 'Cariacó', 'Paquitequete',
            'Chiuba', 'Montepuez', 'Mueda', 'Ancuabe'
        ]
    },
    {
        name: 'Niassa',
        capital: 'Lichinga',
        bairros: [
            'Chiuaula', 'Laucheringo', 'Sanala', 'Nomba', 'Cerâmica',
            'Cuamba', 'Mandimba', 'Metangula'
        ]
    }
];

export const ALL_PROVINCES = MZ_PROVINCES.map(p => p.name);

export const DEFAULT_PROVINCE = 'Sofala';

// Helper to get bairros for a province
export const getBairrosByProvince = (provinceName) => {
    const prov = MZ_PROVINCES.find(p => p.name === provinceName);
    return prov ? prov.bairros : [];
};
