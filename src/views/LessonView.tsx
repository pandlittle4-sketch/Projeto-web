import React, { useState, useEffect, useRef } from 'react';
import { Lesson } from '../types';
import { 
  ArrowLeft, BookOpen, ChevronLeft, ChevronRight, CheckCircle, Video, Sparkles,
  Lock, Unlock, FileText, FileSpreadsheet, Trash2, UploadCloud, Download, ExternalLink, Link, Loader2
} from 'lucide-react';
import { collection, query, where, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { ComplementaryMaterial } from '../types';

interface LessonViewProps {
  lesson: Lesson;
  topicTitle: string;
  isCompleted: boolean;
  onBackToUnit: () => void;
  onCompleteLesson: () => void;
}

export const LessonView: React.FC<LessonViewProps> = ({
  lesson,
  topicTitle,
  isCompleted,
  onBackToUnit,
  onCompleteLesson
}) => {
  const [activeSectionIdx, setActiveSectionIdx] = useState(0);

  const [materials, setMaterials] = useState<ComplementaryMaterial[]>([]);
  const [isLoadingMaterials, setIsLoadingMaterials] = useState(false);
  const [isAdmin, setIsAdmin] = useState(() => sessionStorage.getItem('isAdmin') === 'true');
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');

  // Estados do formulário de upload do administrador
  const [newMaterialTitle, setNewMaterialTitle] = useState('');
  const [newMaterialType, setNewMaterialType] = useState<'pdf' | 'excel' | 'word' | 'link' | 'other'>('pdf');
  const [newMaterialUrl, setNewMaterialUrl] = useState('');
  const [uploadedData, setUploadedData] = useState('');
  const [uploadedName, setUploadedName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const sectionsCount = lesson.sections.length;
  const currentSection = lesson.sections[activeSectionIdx];

  const handleNext = () => {
    if (activeSectionIdx < sectionsCount - 1) {
      setActiveSectionIdx(activeSectionIdx + 1);
    }
  };

  const handlePrev = () => {
    if (activeSectionIdx > 0) {
      setActiveSectionIdx(activeSectionIdx - 1);
    }
  };

  // Busca materiais complementares para a aula atual
  const fetchMaterials = async () => {
    setIsLoadingMaterials(true);
    try {
      const q = query(
        collection(db, 'materials'),
        where('lessonId', '==', lesson.id)
      );
      const querySnapshot = await getDocs(q);
      const fetched: ComplementaryMaterial[] = [];
      querySnapshot.forEach((doc) => {
        fetched.push(doc.data() as ComplementaryMaterial);
      });
      // Ordena por ordem de criação (mais recente primeiro)
      fetched.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setMaterials(fetched);
    } catch (err) {
      console.error('Erro ao buscar materiais complementares:', err);
    } finally {
      setIsLoadingMaterials(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
    // Reseta campos do formulário para novo upload ao mudar de aula
    setNewMaterialTitle('');
    setNewMaterialUrl('');
    setUploadedData('');
    setUploadedName('');
    setFormError('');
    setFormSuccess('');
  }, [lesson.id]);

  const handleVerifyAdmin = () => {
    if (adminPassword === 'admin1802' || adminPassword === '1802' || adminPassword === 'dudu1802') {
      setIsAdmin(true);
      sessionStorage.setItem('isAdmin', 'true');
      setShowAdminLogin(false);
      setAdminPassword('');
      setAdminError('');
    } else {
      setAdminError('Senha incorreta!');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processSelectedFile(file);
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    processSelectedFile(file);
  };

  const processSelectedFile = (file: File) => {
    if (file.size > 800 * 1024) {
      setFormError('O arquivo é muito grande! Limite máximo de tamanho: 800 KB.');
      return;
    }
    setFormError('');

    const reader = new FileReader();
    reader.onload = () => {
      setUploadedData(reader.result as string);
      setUploadedName(file.name);
    };
    reader.onerror = () => {
      setFormError('Não foi possível fazer a leitura do arquivo.');
    };
    reader.readAsDataURL(file);
  };

  const handleSaveMaterial = async () => {
    if (!newMaterialTitle.trim()) {
      setFormError('Determine o título do material complementar.');
      return;
    }

    if (newMaterialType === 'link' && !newMaterialUrl.trim()) {
      setFormError('Informe a URL para o link correspondente.');
      return;
    }

    if (newMaterialType !== 'link' && !uploadedData) {
      setFormError('Arraste ou clique para selecionar o arquivo complementar.');
      return;
    }

    setFormError('');
    setFormSuccess('');
    setIsSaving(true);

    const materialId = `mat_${Date.now()}`;
    const newMaterial: ComplementaryMaterial = {
      id: materialId,
      lessonId: lesson.id,
      title: newMaterialTitle.trim(),
      type: newMaterialType,
      createdAt: new Date().toISOString(),
    };

    if (newMaterialType === 'link') {
      newMaterial.url = newMaterialUrl.trim();
    } else {
      newMaterial.fileData = uploadedData;
    }

    try {
      await setDoc(doc(db, 'materials', materialId), newMaterial);
      setFormSuccess('Material cadastrado e sincronizado no banco de dados com sucesso!');
      setNewMaterialTitle('');
      setNewMaterialUrl('');
      setUploadedData('');
      setUploadedName('');
      fetchMaterials();
    } catch (err) {
      try {
        handleFirestoreError(err, OperationType.WRITE, `materials/${materialId}`);
      } catch (uiErr) {
        setFormError('Restrição de autenticação de regras de segurança para este banco de dados.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteMaterial = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'materials', id));
      fetchMaterials();
    } catch (err) {
      try {
        handleFirestoreError(err, OperationType.DELETE, `materials/${id}`);
      } catch (uiErr) {
        setFormError('Falha ao deletar material: verifique as permissões de acesso.');
      }
    }
  };

  const handleDownloadMaterial = (m: ComplementaryMaterial) => {
    if (m.type === 'link') {
      if (m.url) {
        const secureLink = document.createElement('a');
        secureLink.href = m.url.startsWith('http') ? m.url : `https://${m.url}`;
        secureLink.target = '_blank';
        secureLink.rel = 'noopener noreferrer';
        document.body.appendChild(secureLink);
        secureLink.click();
        document.body.removeChild(secureLink);
      }
      return;
    }

    if (!m.fileData) return;

    try {
      const link = document.createElement('a');
      link.href = m.fileData;
      link.download = `${m.title.replace(/[^a-zA-Z0-9_]/g, '_')}.${getFileExtension(m.type)}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Falha no download:', err);
    }
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-5 h-5" />;
      case 'excel':
        return <FileSpreadsheet className="w-5 h-5" />;
      case 'word':
        return <FileText className="w-5 h-5 font-bold" />;
      case 'link':
        return <Link className="w-5 h-5" />;
      default:
        return <BookOpen className="w-5 h-5" />;
    }
  };

  const getFileIconColors = (type: string) => {
    switch (type) {
      case 'pdf':
        return 'bg-red-50 text-red-600 border border-red-100';
      case 'excel':
        return 'bg-green-50 text-green-700 border border-green-100';
      case 'word':
        return 'bg-blue-50 text-blue-600 border border-blue-100';
      case 'link':
        return 'bg-indigo-50 text-indigo-605 border border-indigo-100';
      default:
        return 'bg-slate-50 text-slate-600 border border-slate-100';
    }
  };

  const getFileExtension = (type: string) => {
    switch (type) {
      case 'pdf': return 'pdf';
      case 'excel': return 'xlsx';
      case 'word': return 'docx';
      default: return 'txt';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-20 text-slate-800">
      {/* Botão de retorno */}
      <button
        id="btn-lesson-back"
        onClick={onBackToUnit}
        className="inline-flex items-center space-x-2 text-slate-500 hover:text-[#03ad3c] text-sm font-semibold transition-colors cursor-pointer group"
      >
        <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform stroke-[2.2px]" />
        <span>Voltar para Trilha</span>
      </button>

      {/* Cabeçalho de aula */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 shadow-sm">
        <div>
          <span className="text-[11px] font-mono font-bold text-[#03ad3c] tracking-wider uppercase bg-green-50 px-3 py-1 rounded-full border border-green-100">
            AULA INTERATIVA
          </span>
          <h2 id="lesson-topic-title" className="text-2xl font-black text-slate-900 mt-2">
            {lesson.title}
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Tópico de estudo: {topicTitle}
          </p>
        </div>

        {/* Status de conclusão da aula */}
        {isCompleted ? (
          <div className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-600 text-xs font-semibold">
            <CheckCircle className="w-4 h-4" />
            <span>Conteúdo Concluído e Gravado!</span>
          </div>
        ) : (
          <button
            id="btn-confirm-complete-lesson"
            onClick={onCompleteLesson}
            className="px-5 py-2.5 bg-[#03ad3c] hover:bg-[#019432] text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center cursor-pointer"
          >
            <CheckCircle className="w-4 h-4 mr-1.5" />
            Marcar Como Concluído (+10 XP)
          </button>
        )}
      </div>

      {/* Seção de vídeo aula */}
      {lesson.videoUrl && (
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center">
            <Video className="w-4.5 h-4.5 text-[#03ad3c] mr-2" />
            Vídeo Aula Explicativa Recomendada
          </h3>
          <div className="aspect-video w-full rounded-2xl overflow-hidden border border-slate-100 shadow-inner">
            <iframe
              id="lesson-video-iframe"
              src={lesson.videoUrl}
              title={lesson.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
              className="w-full h-full border-0"
            />
          </div>
        </div>
      )}

      {/* Seção de Materiais Complementares */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-50 rounded-lg text-[#03ad3c]">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 id="complementary-materials-title" className="text-base font-extrabold text-slate-900">
                Materiais Complementares
              </h3>
              <p className="text-xs text-slate-400 font-medium">
                Baixe apostilas, planilhas ou abra links criados sob medida para acompanhar esta vídeo aula
              </p>
            </div>
          </div>

          <button
            id="btn-admin-mode-toggle"
            onClick={() => {
              if (isAdmin) {
                setIsAdmin(false);
                sessionStorage.removeItem('isAdmin');
              } else {
                setShowAdminLogin(true);
              }
            }}
            className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              isAdmin
                ? 'bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-700'
                : 'bg-slate-55 hover:bg-slate-100 border-slate-200 text-slate-600'
            }`}
          >
            {isAdmin ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
            <span>{isAdmin ? 'Modo Admin: Ativo' : 'Área do Professor'}</span>
          </button>
        </div>

        {/* Modal/Formulário para autenticação de administrador */}
        {showAdminLogin && !isAdmin && (
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4 animate-fade-in">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-mono font-bold text-slate-700 uppercase tracking-wider">
                Verificação de Administrador
              </h4>
              <button
                onClick={() => {
                  setShowAdminLogin(false);
                  setAdminError('');
                }}
                className="text-xs text-slate-400 hover:text-slate-600 font-semibold"
              >
                Voltar
              </button>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                id="input-admin-password"
                type="password"
                placeholder="Insira a senha de administrador..."
                value={adminPassword}
                onChange={(e) => {
                  setAdminPassword(e.target.value);
                  setAdminError('');
                }}
                className="flex-1 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#03ad3c]/20 focus:border-[#03ad3c] focus:outline-none transition-all"
              />
              <button
                id="btn-submit-admin"
                onClick={handleVerifyAdmin}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Acessar
              </button>
            </div>
            {adminError && <p className="text-[11px] text-red-500 font-medium">{adminError}</p>}
            <p className="text-[11px] text-slate-400 leading-relaxed font-sans mt-1">
              Painel restrito para professores inserirem apostilas referentes à trilha corrente.
            </p>
          </div>
        )}

        {/* Formulário de Upload do Administrador */}
        {isAdmin && (
          <div className="bg-amber-50/40 border border-amber-200/50 rounded-2xl p-5 sm:p-6 space-y-5 animate-fade-in/95">
            <div className="flex items-center justify-between border-b border-amber-200/30 pb-3">
              <div className="flex items-center space-x-2">
                <UploadCloud className="w-4.5 h-4.5 text-amber-600" />
                <h4 className="text-xs font-bold text-amber-800 uppercase tracking-widest">
                  Cadastrar Novo Material Complementar
                </h4>
              </div>
              <span className="text-[10px] bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full font-mono font-bold">
                Aula Atual: {lesson.title}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Título para Exibição</label>
                <input
                  id="input-material-title"
                  type="text"
                  placeholder="Ex: Planilha de Gráficos e Funções extras"
                  value={newMaterialTitle}
                  onChange={(e) => setNewMaterialTitle(e.target.value)}
                  className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Tipo de Recurso</label>
                <select
                  id="select-material-type"
                  value={newMaterialType}
                  onChange={(e) => {
                    setNewMaterialType(e.target.value as any);
                    setNewMaterialUrl('');
                    setUploadedData('');
                    setUploadedName('');
                  }}
                  className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all cursor-pointer"
                >
                  <option value="pdf">Apostila em PDF (.pdf)</option>
                  <option value="excel">Tabela em Excel ou CSV (.xlsx, .csv)</option>
                  <option value="word">Documento do Word (.docx)</option>
                  <option value="link">Link de Apoio Externo (Web Link)</option>
                  <option value="other">Outros formatos</option>
                </select>
              </div>
            </div>

            {/* Seleção do arquivo ou link */}
            {newMaterialType === 'link' ? (
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Hiperlink do Documento (Ex: Google Drive)</label>
                <input
                  id="input-material-url"
                  type="text"
                  placeholder="Ex: https://drive.google.com/..."
                  value={newMaterialUrl}
                  onChange={(e) => setNewMaterialUrl(e.target.value)}
                  className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                />
              </div>
            ) : (
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Carregar Arquivo Local</label>
                <div
                  id="drop-zone-material"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleFileDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                    uploadedName 
                      ? 'border-emerald-300 bg-emerald-50/10' 
                      : 'border-slate-300 bg-white hover:border-amber-400 hover:bg-amber-50/5'
                  }`}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept={
                      newMaterialType === 'pdf' ? '.pdf' :
                      newMaterialType === 'excel' ? '.xlsx,.xls,.csv' :
                      newMaterialType === 'word' ? '.docx,.doc' : 
                      '*'
                    }
                    className="hidden"
                  />
                  <div className="flex flex-col items-center space-y-2">
                    <UploadCloud className={`w-8 h-8 ${uploadedName ? 'text-emerald-500' : 'text-slate-400'}`} />
                    {uploadedName ? (
                      <div>
                        <p className="text-xs font-bold text-emerald-800">{uploadedName}</p>
                        <p className="text-[10px] text-emerald-600 font-semibold uppercase mt-0.5">Leitura realizada com sucesso!</p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-xs text-slate-600 font-bold">
                          Arraste seu arquivo para cá ou clique em qualquer lugar para selecionar
                        </p>
                        <p className="text-[10px] text-slate-405 mt-0.5">
                          Tamanho máximo otimizado para o banco: 800 KB
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {formError && <p className="text-xs text-red-500 font-bold">{formError}</p>}
            {formSuccess && <p className="text-xs text-emerald-600 font-black">{formSuccess}</p>}

            <div className="flex justify-end space-x-3">
              <button
                id="btn-cancel-add-material"
                onClick={() => {
                  setNewMaterialTitle('');
                  setNewMaterialUrl('');
                  setUploadedData('');
                  setUploadedName('');
                  setFormError('');
                  setFormSuccess('');
                }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Limpar
              </button>
              <button
                id="btn-save-material-db"
                disabled={isSaving}
                onClick={handleSaveMaterial}
                className="px-5 py-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-extrabold rounded-xl text-xs transition-colors flex items-center space-x-1.5 cursor-pointer shadow-sm shadow-amber-300"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Salvando...</span>
                  </>
                ) : (
                  <span>Anexar e Sincronizar</span>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Listagem de materiais complementares disponíveis */}
        {isLoadingMaterials ? (
          <div className="flex flex-col items-center justify-center py-10 space-y-3">
            <Loader2 className="w-7 h-7 text-[#03ad3c] animate-spin" />
            <p className="text-xs text-slate-400 font-medium">Lendo materiais complementares de apoio...</p>
          </div>
        ) : materials.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {materials.map((m) => (
              <div
                key={m.id}
                className="flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 border border-slate-150/40 rounded-2xl group transition-all duration-200"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <div className={`p-2.5 rounded-xl shrink-0 ${getFileIconColors(m.type)}`}>
                    {getFileIcon(m.type)}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-800 truncate pr-2" title={m.title}>
                      {m.title}
                    </h4>
                    <p className="text-[10px] text-slate-400 font-bold tracking-wider uppercase mt-0.5">
                      {m.type === 'link' ? 'Link de Apoio' : `Material ${m.type.toUpperCase()}`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleDownloadMaterial(m)}
                    className="p-2 bg-white hover:bg-[#03ad3c]/10 text-slate-700 hover:text-[#03ad3c] rounded-xl border border-slate-200 hover:border-[#03ad3c]/20 shadow-xs transition-colors flex items-center space-x-1 cursor-pointer"
                    title={m.type === 'link' ? 'Abrir Link do Documento' : 'Baixar Material'}
                  >
                    {m.type === 'link' ? <ExternalLink className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
                    <span className="text-[10px] font-bold hidden sm:inline">
                      {m.type === 'link' ? 'Visualizar' : 'Baixar'}
                    </span>
                  </button>

                  {isAdmin && (
                    <button
                      onClick={() => {
                        if (confirm('Tem certeza que deseja excluir este material de forma definitiva?')) {
                          handleDeleteMaterial(m.id);
                        }
                      }}
                      className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl border border-red-100 hover:border-red-200 transition-colors cursor-pointer"
                      title="Excluir Material"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="border border-dashed border-slate-205 rounded-3xl p-8 text-center bg-slate-50/40">
            <div className="flex flex-col items-center space-y-2">
              <FileText className="w-8 h-8 text-slate-350" />
              <p className="text-xs text-slate-700 font-bold">Nenhum material de apoio anexado nesta aula.</p>
              <p className="text-[10px] text-slate-400 px-4">
                Lembrete pedagógico: Apostilas adicionais e tabelas são colocadas gradativamente pelo time docente.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Conteúdo Teórico de Estudo com Paginação */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm min-h-[350px] flex flex-col justify-between">
        <div className="space-y-6">
          <div className="flex justify-between items-center border-b border-slate-100 pb-4">
            <h4 id="lesson-section-headline" className="text-base font-extrabold text-slate-900">
              {currentSection.title || 'Resumos Teóricos'}
            </h4>
            <span className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">
              Seção {activeSectionIdx + 1} de {sectionsCount}
            </span>
          </div>

          {/* Parágrafos explicativos da trilha teórica */}
          <div id="lesson-text-body" className="space-y-4 text-slate-600 text-sm leading-relaxed font-sans">
            {currentSection.content.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>

          {/* Card de destaque pedagógico opcional */}
          {currentSection.highlight && (
            <div className="p-4.5 bg-amber-50 border-l-4 border-amber-500 rounded-r-xl text-amber-700 text-xs leading-relaxed flex items-start space-x-2.5">
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <span>{currentSection.highlight}</span>
            </div>
          )}
        </div>

        {/* Botões de navegação e conclusão */}
        <div className="border-t border-slate-100 pt-6 flex items-center justify-between">
          <button
            id="btn-lesson-prev"
            disabled={activeSectionIdx === 0}
            onClick={handlePrev}
            className="px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 disabled:opacity-40 text-slate-600 hover:text-slate-900 rounded-xl text-xs font-bold transition-all flex items-center space-x-1 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Anterior</span>
          </button>

          {activeSectionIdx < sectionsCount - 1 ? (
            <button
              id="btn-lesson-next"
              onClick={handleNext}
              className="px-5 py-2.5 bg-[#03ad3c] hover:bg-[#019432] text-white rounded-xl text-xs font-extrabold transition-all flex items-center space-x-1 cursor-pointer"
            >
              <span>Próximo</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            !isCompleted && (
              <button
                id="btn-lesson-finish"
                onClick={onCompleteLesson}
                className="px-5 py-2.5 bg-[#03ad3c] hover:bg-[#019432] text-white font-extrabold rounded-xl text-xs transition-all flex items-center cursor-pointer shadow-md"
              >
                Concluir Estudo
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};
