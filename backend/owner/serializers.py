from rest_framework import serializers
from .models import Warehouse, WarehouseMedia

class WarehouseMediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = WarehouseMedia
        fields = ['id', 'file', 'media_type', 'uploaded_at']

class WarehouseSerializer(serializers.ModelSerializer):
    media = WarehouseMediaSerializer(many=True, read_only=True)
    owner = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Warehouse
        fields = '__all__'
        read_only_fields = ['owner', 'created_at']

    def create(self, validated_data):
        request = self.context.get('request')
        validated_data['owner'] = request.user
        return super().create(validated_data)
