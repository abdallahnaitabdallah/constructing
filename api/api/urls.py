from django.urls import path
from .views import (
    ConstructionRequestListCreateView,
    ConstructionRequestRetrieveUpdateDeleteView,
    CaseStudiesList,
    CaseStudiesDetail,
    ChatMessageListCreateView,
    NonAdminUserListView
)

app_name = 'api'

urlpatterns = [
    path('construction-requests/', ConstructionRequestListCreateView.as_view(), name='construction-request-list-create'),
    path('construction-requests/<int:pk>/', ConstructionRequestRetrieveUpdateDeleteView.as_view(), name='construction-request-detail'),
    path('case-studies/', CaseStudiesList.as_view(), name='case-studies-list'),
    path('case-studies/<int:pk>/', CaseStudiesDetail.as_view(), name='case-studies-detail'),
    path('chat-messages/', ChatMessageListCreateView.as_view(), name='chat-message-list-create'),
    path('non-admin-user/',NonAdminUserListView.as_view(),name='non-admin-user'),
]
