import streamlit as st
from utils.loader import loadDocs
from utils.retriever import buildIndex, queryIndex
from utils.llm import getAnswer

st.set_page_config(
    page_title="DevOps KB",
    page_icon="🔧",
    layout="wide"
)

st.markdown("""
    <style>
    body { background-color: #0e0e0e; }
    .stApp { background-color: #0e0e0e; color: #f0f0f0; }
    .stTextInput>div>div>input { background-color: #1a1a1a; color: #f0f0f0; border: 1px solid #333; }
    .stFileUploader { background-color: #1a1a1a; }
    .stButton>button { background-color: #ff6b00; color: white; border: none; border-radius: 6px; }
    .stButton>button:hover { background-color: #e05e00; }
    .stSidebar { background-color: #111; }
    div[data-testid="stSidebar"] { background-color: #111111; }
    </style>
""", unsafe_allow_html=True)

with st.sidebar:
    st.markdown("### ⚙️ Config")
    apiKey = st.text_input("Groq API Key", type="password", placeholder="gsk_...")
    st.markdown("---")
    st.markdown("**How to use**")
    st.markdown("1. Enter your Groq API key\n2. Upload your runbooks\n3. Ask anything")
    st.markdown("---")
    st.markdown("<small>Built by Ninad Chemburkar</small>", unsafe_allow_html=True)

st.title("DevOps Knowledge Base")
st.markdown("Chat with your runbooks and internal docs.")

uploadedFiles = st.file_uploader(
    "Upload runbooks (.txt files)",
    type=["txt"],
    accept_multiple_files=True
)

if uploadedFiles:
    try:
        chunks = loadDocs(uploadedFiles)
        collection = buildIndex(chunks)
        st.success(f"{len(uploadedFiles)} file(s) indexed — {len(chunks)} chunks ready.")

        question = st.text_input("Ask a question about your docs")

        if question:
            if not apiKey:
                st.error("No API key found. Add your Groq API key in the sidebar to continue.")
            else:
                ctx = queryIndex(collection, question)
                answer = getAnswer(apiKey, ctx, question)
                st.markdown("### Answer")
                st.markdown(answer)
                with st.expander("Source chunks used"):
                    for i, c in enumerate(ctx):
                        st.markdown(f"**Chunk {i+1}:** {c}")

    except Exception as e:
        st.error(str(e))