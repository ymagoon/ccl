<?xml version="1.0" encoding="UTF-8"?>
<?dynamic-document type="format" version="7.0"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:xs="http://www.w3.org/2001/XMLSchema"
	xmlns:fn="http://www.w3.org/2005/xpath-functions"
	xmlns:n="urn:com-cerner-patient-ehr:v3"
	xmlns:java-string="java:java.lang.String"
	xmlns:cdocfx="urn:com-cerner-physician-documentation-functions"
	xmlns:dd="DynamicDocumentation"
	xmlns:xr-date-formatter="java:com.cerner.xsl.util.XSLTDateUtilities"
	exclude-result-prefixes="xsl xs fn n cdocfx xr-date-formatter">

	<xsl:output method="html" encoding="UTF-8" indent="yes"/>
	
	<xsl:param as="xs:string" name="current-locale" select="'en_US'"/>

	<!-- required to include CommonFxn.xslt -->
	<!-- Comment this line to debug--> <xsl:include href="/cernerbasiccontent/formats/dxcommonfxn.xslt" /> 
	<!-- Uncomment this line to debug  <xsl:include href="dxcommonfxn.xslt" /> -->

	<!-- Default string constants -->
	<xsl:variable name="DATE_ONLY_SEQUENCE" as="xs:string" select="'MM/dd/yyyy'"/>
	
	<xsl:variable name="Separator" as="xs:string">
		<xsl:value-of select="', %s'"/>
	</xsl:variable>
	
	<!-- displayPriority will be overwritten by the locale specific format. If true, format will display the priority of the diagnosis. -->
	<xsl:variable name="displayPriority" as="xs:boolean" select="true()"/>
	
	<!-- displayDate will be overwritten by the locale specific format. If true, format will display the diagnosis date. -->
	<xsl:variable name="displayDate" as="xs:boolean" select="true()"/>

	<!-- Keys -->
	<xsl:key name="keyDxByNomenId" match="n:report/n:clinical-data/n:diagnosis-data/n:clinical-diagnosis" use="n:diagnosis-name/n:nomenclature"/>
	
	<!-- Get diagnosis type display of the given diagnosis. -->
	<!-- Parameters: -->
	<!--	dx - diagnosis object -->
	<xsl:function name="cdocfx:getDxTypeDisplay" as="xs:string">
		<xsl:param name="dx"/>
		<xsl:choose>
			<xsl:when test="$dx/@confirmation-code">
				<xsl:value-of select="cdocfx:getCodeDisplayByID($dx/@type-code)"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="''"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:function>
	
	<!-- Get classification display of the given diagnosis. -->
	<!-- Parameters: -->
	<!--	dx - diagnosis object -->
	<xsl:function name="cdocfx:getDxClassificationDisplay" as="xs:string">
		<xsl:param name="dx"/>
		<xsl:choose>
			<xsl:when test="$dx/@classification-code">
				<xsl:value-of select="cdocfx:getCodeDisplayByID($dx/@classification-code)"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="''"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:function>
	
	<!-- Get Diagnosis Date of the given diagnosis. -->
	<!-- Parameters: -->
	<!--	dx - diagnosis object -->
	<xsl:function name="cdocfx:getDiagnosisDate" as="xs:string">
		<xsl:param name="dx"/>
		<xsl:choose>
			<xsl:when test="$dx/n:diagnosis-dt-tm">
				<xsl:variable name="tz" select="$dx/n:diagnosis-dt-tm/@time-zone"/>
				<xsl:variable name="dxDtTm" as="xs:dateTime" select="$dx/n:diagnosis-dt-tm"/>
				<xsl:value-of select="xr-date-formatter:formatDate($dxDtTm, $DATE_ONLY_SEQUENCE, $tz, $current-locale)"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="''"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:function>
	
	<!-- Templates -->
	
	<!-- Format the desired additional diagnosis information. -->
	<!-- Undesired additional information can be commented out or removed here. -->
	<!-- Parameters: -->
	<!--   dx - diagnosis node -->
	<xsl:template name="tempAdditionalDxInformation">
		<xsl:param name="dx"/>
		
		<!-- Diagnosis type 
		<xsl:if test="$dx/@confirmation-code">
			<xsl:value-of select="java-string:format($Separator, cdocfx:getDxTypeDisplay($dx))" disable-output-escaping="yes"/>
		</xsl:if>
		-->
		<!-- Diagnosis Classification 
		<xsl:if test="$dx/@classification-code">
			<xsl:value-of select="java-string:format($Separator, cdocfx:getDxClassificationDisplay($dx))" disable-output-escaping="yes" />
		</xsl:if>
		-->
		<!-- Nomenclature information -->
		<xsl:if test="$dx/n:diagnosis-name/n:nomenclature">
			<xsl:variable name="nomenclatureId" as="xs:string" select="$dx/n:diagnosis-name/n:nomenclature" />
			
			<!-- Source-Identifier 
			<xsl:variable name="nomSrcId" as="xs:string" select="cdocfx:getNomenclatureCodeDispByID($nomenclatureId)"/>
			<xsl:if test="normalize-space($nomSrcId)">
				<xsl:value-of select="java-string:format($Separator, $nomSrcId)" disable-output-escaping="yes" />
			</xsl:if>
			-->
			<!-- Description 
			<xsl:variable name="nomDescription" as="xs:string" select="cdocfx:getNomenclatureDescByID($nomenclatureId)"/>
			<xsl:if test="normalize-space($nomDescription)">
				<xsl:value-of select="java-string:format($Separator, $nomDescription)" disable-output-escaping="yes" />
			</xsl:if>
			-->
			<!-- Mnemonic 
			<xsl:variable name="nomMnemonic" as="xs:string" select="cdocfx:getNomenclatureMnemonicByID($nomenclatureId)"/>
			<xsl:if test="normalize-space($nomMnemonic)">
				<xsl:value-of select="java-string:format($Separator, $nomMnemonic)" disable-output-escaping="yes" />
			</xsl:if>
			-->
			<!-- Short Description 
			<xsl:variable name="nomShortDesc" as="xs:string" select="cdocfx:getNomenclatureShortDescByID($nomenclatureId)"/>
			<xsl:if test="normalize-space($nomShortDesc)">
				<xsl:value-of select="java-string:format($Separator, $nomShortDesc)" disable-output-escaping="yes" />
			</xsl:if>
			-->
			<!-- Terminology Cd 
			<xsl:variable name="nomTerminologyCd" as="xs:string" select="cdocfx:getNomenclatureTerminologyCdByID($nomenclatureId)"/>
			<xsl:if test="normalize-space($nomTerminologyCd)">
				<xsl:value-of select="java-string:format($Separator, $nomTerminologyCd)" disable-output-escaping="yes" />
			</xsl:if>
			-->
			<!-- Concept CKI 
			<xsl:variable name="nomConceptCKI" as="xs:string" select="cdocfx:getNomenclatureConceptCKIByID($nomenclatureId)"/>
			<xsl:if test="normalize-space($nomConceptCKI)">
				<xsl:value-of select="java-string:format($Separator, $nomConceptCKI)" disable-output-escaping="yes" />
			</xsl:if>
			-->
		</xsl:if>
		
		<!-- Diagnoses Date -->
		<xsl:if test="$displayDate = true() and $dx/n:diagnosis-dt-tm">
			<xsl:value-of select="java-string:format($Separator, cdocfx:getDiagnosisDate($dx))" disable-output-escaping="yes" />
		</xsl:if>
	</xsl:template>
	
	<!-- Format given diagnosis by populating ddemrcontentitem attributes and text -->
	<!-- Parameters: -->
	<!--	dx - diagnosis node -->
	<xsl:template name="tempClinicalDiagnosis" >
		<xsl:param name="dx"/>
			<xsl:attribute name="dd:entityid">
				<xsl:value-of select="$dx/@id"/>
			</xsl:attribute>
			<xsl:attribute name="dd:contenttype">
				<xsl:text>DIAGNOSES</xsl:text>
			</xsl:attribute>
			<xsl:if test="$displayPriority = true()">
				<xsl:value-of select="cdocfx:getDxPriorityDisplay($dx)" disable-output-escaping="yes"/>
			</xsl:if>
			
			<xsl:value-of select="cdocfx:getDxDisplay($dx)"/>
			
			<xsl:call-template name="tempAdditionalDxInformation">
				<xsl:with-param name="dx" select="$dx"/>
			</xsl:call-template>
	</xsl:template>

	<!-- Format diagnoses by given nomenclature id and clinical-diagnosis nodes -->
	<!-- Parameters: -->
	<!--	dxNomenId - diagnosis nomenclature id -->
	<!-- 	dxList - a list of diagnosis-data node -->
	<xsl:template name="tempDiagnosisByNomenId">
		<xsl:param name="dxNomenId" as="xs:string"/>
		<xsl:param name="dxList"/>

		<xsl:variable name="dxSize" select="fn:count($dxList)"/>
		<xsl:choose>
			<xsl:when test="$dxSize>1">
				<div class="ddgrouper ddinsertfreetext ddremovable">
				
					<xsl:for-each select="$dxList">
						<xsl:sort select="cdocfx:getDxPriority(.)"/>
						<xsl:sort select="fn:upper-case(cdocfx:getDxDisplay(.))"/>
						<span class="ddemrcontentitem">
							<!-- Format diagnosis item -->
							<xsl:attribute name="dd:entityid">
								<xsl:value-of select="@id"/>
							</xsl:attribute>
							<xsl:attribute name="dd:contenttype">
								<xsl:text>DIAGNOSES</xsl:text>
							</xsl:attribute>
							<!-- Diagnosis having the same nomenclature are grouped together, we display priority for only
								 first diagnosis as it has the highest priority in a nomenclature group. -->
							<xsl:if test="$displayPriority = true() and fn:position() = 1">
								<xsl:value-of select="cdocfx:getDxPriorityDisplay(.)" disable-output-escaping="yes"/>
							</xsl:if>
							<xsl:value-of select="cdocfx:getDxDisplay(.)"/>
							<xsl:if test="fn:not(fn:position() = fn:last())">
								<xsl:text disable-output-escaping="yes">,<![CDATA[&#160;]]></xsl:text>
							</xsl:if>
						</span>
					</xsl:for-each>
				</div>
			</xsl:when>
			<xsl:when test="$dxSize=1">
				<div class="ddemrcontentitem ddinsertfreetext ddremovable">
					<!-- Format diagnosis item -->
					<xsl:call-template name="tempClinicalDiagnosis">
						<xsl:with-param name="dx" select="$dxList[1]"/>
					</xsl:call-template>		
				</div>
			</xsl:when>
		</xsl:choose>
	</xsl:template>

	<!-- Recursively format diagnoses from a list of clinical-diagnosis nodes -->
	<!-- Parameters: -->
	<!--	dxNomenId - diagnosis nomenclature ids that has been handled -->
	<!-- 	dxList - a list of diagnosis-data node -->
	<xsl:template name="tempClinicalDiagnoses">
		<xsl:param name="dxNomenIDs"/>
		<xsl:param name="dxList"/>
		<xsl:variable name="diagnosis" select="$dxList[1]"/>
		<xsl:if test="fn:count($dxList)>0">
			<xsl:choose>
				<!-- this diagnosis has nomenclature -->
				<xsl:when test="$diagnosis/n:diagnosis-name/n:nomenclature">
					<xsl:variable name="nomenId" select="$diagnosis/n:diagnosis-name/n:nomenclature"/>
					<xsl:choose>
						<!-- Diagnosis with nomenclature id that has been rendered -->
						<xsl:when test="fn:count(fn:distinct-values($nomenId|$dxNomenIDs))=count(fn:distinct-values($dxNomenIDs))">
							<!-- Ignore and move on to next -->
							<xsl:if test="fn:count($dxList)>1">
								<xsl:call-template name="tempClinicalDiagnoses">
									<xsl:with-param name="dxNomenIDs" select="$dxNomenIDs"/>
									<xsl:with-param name="dxList" select="$dxList[position() &gt; 1]"/>
								</xsl:call-template>
							</xsl:if>
						</xsl:when>
						<!-- Diagnosis with nomenclature id that has NOT been rendered -->
						<xsl:otherwise>
							<!-- Render all diagnoses with the same nomenclature and orders associated with them -->
							<xsl:call-template name="tempDiagnosisByNomenId">
								<xsl:with-param name="dxNomenId" select="$nomenId"/>
								<xsl:with-param name="dxList" select="key('keyDxByNomenId', $nomenId, $root-node)[@is-active='true']"/>
							</xsl:call-template>
							<!-- Add nomenclature id to the handled list, and move on the rest of the diagnoses list -->
							<xsl:if test="fn:count($dxList)>1">
								<xsl:call-template name="tempClinicalDiagnoses">
									<xsl:with-param name="dxNomenIDs" select="$dxNomenIDs|$nomenId"/>
									<xsl:with-param name="dxList" select="$dxList[position() &gt; 1]"/>
								</xsl:call-template>
							</xsl:if>
						</xsl:otherwise>
					</xsl:choose>
				</xsl:when>
				<!-- this is a free text diagnosis -->
				<xsl:otherwise>
					<!-- Render this diagnosis -->
					<div class="ddemrcontentitem ddinsertfreetext ddremovable">
						<!-- Format diagnosis item -->
						<xsl:call-template name="tempClinicalDiagnosis">
							<xsl:with-param name="dx" select="$diagnosis"/>
						</xsl:call-template>
					</div>
					<!-- And move on to next -->
					<xsl:if test="fn:count($dxList)>1">
						<xsl:call-template name="tempClinicalDiagnoses">
							<xsl:with-param name="dxNomenIDs" select="$dxNomenIDs"/>
							<xsl:with-param name="dxList" select="$dxList[position() &gt; 1]"/>
						</xsl:call-template>
					</xsl:if>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:if>
	</xsl:template>

	<!-- main template -->
	<xsl:template match="/">
		<!-- Get all diagnosis, sorted by display -->
		<xsl:variable name="dxList">
			<xsl:perform-sort select="n:report/n:clinical-data/n:diagnosis-data/n:clinical-diagnosis[@is-active='true']">
				<!-- Sort diagnosis by clinical-priority, diagnoses having priority of 999 or no priority are sorted by display -->
				<xsl:sort select="cdocfx:getDxPriority(.)"/>
				<xsl:sort select="fn:upper-case(cdocfx:getDxDisplay(.))"/>
			</xsl:perform-sort>
		</xsl:variable>
		<!-- Get all diagnosis nomenclature ids -->
		<xsl:variable name="dxNomenIDs" select="n:report/n:clinical-data/n:diagnosis-data/n:clinical-diagnosis/n:diagnosis-name/n:nomenclature[../../@is-active='true']"/>

		<!-- Format diagnoses and associated orders -->
		<xsl:if test="fn:count($dxList/n:clinical-diagnosis)>0">
			<xsl:call-template name="tempClinicalDiagnoses">
				<xsl:with-param name="dxNomenIDs" select="/.."/>
				<xsl:with-param name="dxList" select="$dxList/n:clinical-diagnosis"/>
			</xsl:call-template>
		</xsl:if>
	</xsl:template>
</xsl:stylesheet>
