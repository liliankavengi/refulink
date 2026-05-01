from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="MpesaTransaction",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("mpesa_receipt", models.CharField(db_index=True, max_length=20, unique=True)),
                ("phone_number", models.CharField(max_length=15)),
                ("amount_kes", models.DecimalField(decimal_places=2, max_digits=12)),
                ("tx_type", models.CharField(
                    choices=[("deposit", "Deposit (C2B)"), ("withdrawal", "Withdrawal (B2C)")],
                    max_length=12,
                )),
                ("status", models.CharField(
                    choices=[
                        ("pending",   "Pending"),
                        ("confirmed", "Confirmed"),
                        ("minted",    "Minted"),
                        ("burned",    "Burned"),
                        ("failed",    "Failed"),
                    ],
                    default="pending",
                    max_length=12,
                )),
                ("stellar_tx_hash", models.CharField(blank=True, default="", max_length=64)),
                ("raw_payload", models.JSONField(default=dict)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("user", models.ForeignKey(
                    blank=True,
                    null=True,
                    on_delete=django.db.models.deletion.SET_NULL,
                    related_name="mpesa_transactions",
                    to=settings.AUTH_USER_MODEL,
                )),
            ],
            options={"ordering": ["-created_at"]},
        ),
    ]
